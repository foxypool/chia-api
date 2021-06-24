const Base = require('./base');
const { SERVICE } = require('../constants');

class Plotter extends Base {
  get destination() {
    return SERVICE(this.connection.coin).plotter;
  }

  async init() {
    this.connection.addService(SERVICE(this.connection.coin).plotter);
    if (!this.connection.connected) {
      await this.connection.connect();
    } else {
      await this.connection.registerServices();
    }
  }

  onNewPlottingQueueStats(cb) {
    this.connection.onMessage(message => {
      if (message.command !== 'state_changed' || (message.data.state !== 'state_changed' && message.data.state !== 'log_changed')) {
        return;
      }
      cb(message.data.queue);
    });
    this.onRegisterServiceResult(data => cb(data.queue));
  }
}

module.exports = Plotter;
