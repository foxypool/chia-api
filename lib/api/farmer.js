const Base = require('./base');
const Message = require('../message');
const { SERVICE } = require('../constants');

class Farmer extends Base {
  get destination() {
    return SERVICE.farmer;
  }

  async getSignagePoints() {
    const res = await this.connection.send(new Message({
      command: 'get_signage_points',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.signage_points;
  }
}

module.exports = Farmer;
