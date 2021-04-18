const Message = require('../message');

class Base {
  constructor({ connection, origin }) {
    this.connection = connection;
    this.origin = origin;
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

  get destination() {
    return null;
  }
}

module.exports = Base;
