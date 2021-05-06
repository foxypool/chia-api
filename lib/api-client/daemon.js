const Base = require('./base');
const Message = require('../message');
const { SERVICE } = require('../constants');

class Daemon extends Base {
  get destination() {
    return SERVICE.daemon;
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
}

module.exports = Daemon;
