const Base = require('./base');
const Message = require('../message');
const { makeServiceNames } = require('../constants');

class Daemon extends Base {
  get destination() {
    return makeServiceNames(this.connection.coin).daemon;
  }

  async registerService(serviceName) {
    const res = await this.connection.send(new Message({
      command: 'register_service',
      data: { service: serviceName },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }

  async isServiceRunning(serviceName) {
    const res = await this.connection.send(new Message({
      command: 'is_running',
      data: { service: serviceName },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.is_running;
  }

  async getVersion() {
    const res = await this.connection.send(new Message({
      command: 'get_version',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.version;
  }
}

module.exports = Daemon;
