const Base = require('./base');
const Message = require('../message');
const { SERVICE } = require('../constants');

class Farmer extends Base {
  get destination() {
    return SERVICE(this.connection.coin).farmer;
  }

  onNewFarmingInfo(cb) {
    this.connection.onMessage(message => {
      if (message.command !== 'new_farming_info') {
        return;
      }
      cb(message.data.farming_info);
    });
  }

  onNewSignagePoint(cb) {
    this.connection.onMessage(message => {
      if (message.command !== 'new_signage_point') {
        return;
      }
      cb(message.data.signage_point);
    });
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
