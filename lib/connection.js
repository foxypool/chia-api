const WebSocket = require('ws');
const EventEmitter = require('events');

const { sleep } = require('./util');
const Message = require('./message');
const { Daemon } = require('./api-client');

class Connection {
  constructor(address, { cert, key, timeoutInSeconds = 30 } = {}) {
    this.address = address;
    this.options = {
      cert,
      key,
    };
    this.timeoutInSeconds = timeoutInSeconds;
    this.connected = false;
    this.events = new EventEmitter();
    this.callbackMap = new Map();
    this.services = new Map();
    this.registeredServices = new Map();
    this.shouldRconnect = true;
  }

  addService(serviceName) {
    this.services.set(serviceName, serviceName);
  }

  async connect() {
    this.connected = false;
    this.ws = new WebSocket(`wss://${this.address}`, {
      ...this.options,
      rejectUnauthorized: false,
    });
    const isOpen = new Promise((resolve, reject) => {
      let resolved = false;
      this.ws.once('open', () => {
        if (resolved) {
          return;
        }
        resolved = true;
        resolve();
      });
      this.ws.once('error', (err) => {
        if (resolved) {
          return;
        }
        resolved = true;
        reject(err);
      });
    });

    this.ws.on('open', this.onOpen.bind(this));
    this.ws.on('close', this.onClose.bind(this));
    this.ws.on('error', this.events.emit);
    this.ws.on('message', data => {
      const message = Message.fromJSON(data);
      if (this.callbackMap.has(message.requestId)) {
        if (message.command === 'register_service') {
          this.events.emit('message', message);
        }
        const { resolve, reject } = this.callbackMap.get(message.requestId);
        this.callbackMap.delete(message.requestId);
        if (message.data.error) {
          return reject(new Error(message.data.error));
        }
        if (message.data.success === false) {
          return reject(new Error(`Request failed: ${JSON.stringify(message.data)}`));
        }
        resolve(message);
      } else {
        this.events.emit('message', message);
      }
    });

    await isOpen;
    await this.registerServices();
  }

  onOpen() {
    this.connected = true;
  }

  async onClose() {
    this.connected = false;
    this.registeredServices.clear();
    if (!this.shouldRconnect) {
      return;
    }
    await sleep(1000);
    try {
      await this.connect();
    } catch (err) {
      this.events.emit('error', err);
    }
  }

  onMessage(cb) {
    this.events.on('message', cb);
  }

  onError(cb) {
    this.events.on('error', cb);
  }

  async send(message) {
    if (!this.connected) {
      throw new Error('Can not send while not connected');
    }

    return new Promise((resolve, reject) => {
      this.callbackMap.set(message.requestId, { resolve, reject });
      this.ws.send(message.toJSON());
      setTimeout(() => {
        if (!this.callbackMap.has(message.requestId)) {
          return;
        }
        this.callbackMap.delete(message.requestId);
        reject(new Error(`Timeout of ${this.timeoutInSeconds} seconds reached`));
      }, this.timeoutInSeconds * 1000);
    });
  }

  async registerServices() {
    if (!this.connected) {
      throw new Error('Can not register services while not connected');
    }
    const unregisteredServices = Array.from(this.services.values()).filter(serviceName => !this.registeredServices.has(serviceName));
    for (let service of unregisteredServices) {
      const daemon = new Daemon({ connection: this, origin: service });
      await daemon.registerService(service);
      this.registeredServices.set(service, service);
    }
  }

  async close() {
    if (!this.connected) {
      return;
    }
    this.shouldRconnect = false;
    this.ws.close();
    while (this.connected) {
      await sleep(100);
    }
    this.shouldRconnect = true;
  }
}

module.exports = Connection;
