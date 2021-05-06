const Message = require('../message');

class Base {
  constructor({ connection, origin }) {
    this.connection = connection;
    this.origin = origin;
  }

  onConnectionChange(cb) {
    this.connection.onMessage(message => {
      if (message.command !== 'get_connections' || message.origin !== this.destination) {
        return;
      }
      cb(message.data.connections);
    });
  }

  onRegisterServiceResult(cb) {
    this.connection.onMessage(message => {
      if (message.command !== 'register_service' || message.destination !== this.destination) {
        return;
      }
      cb(message.data);
    });
  }

  async init() {
    this.connection.addService(this.origin);
    if (!this.connection.connected) {
      await this.connection.connect();
    } else {
      await this.connection.registerServices();
    }
  }

  async ping() {
    await this.connection.send(new Message({
      command: 'ping',
      origin: this.origin,
      destination: this.destination,
    }));
  }

  async getConnections() {
    const res = await this.connection.send(new Message({
      command: 'get_connections',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.connections;
  }

  get destination() {
    return null;
  }
}

module.exports = Base;
