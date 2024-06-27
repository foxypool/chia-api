const Base = require('./base');
const Message = require('../message');
const { makeServiceNames } = require('../constants');

class Harvester extends Base {
  get destination() {
    return makeServiceNames(this.connection.coin).harvester;
  }

  async getPlots() {
    const res = await this.connection.send(new Message({
      command: 'get_plots',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }

  async refreshPlots() {
    await this.connection.send(new Message({
      command: 'refresh_plots',
      origin: this.origin,
      destination: this.destination,
    }));
  }
}

module.exports = Harvester;
