const { randomBytes } = require('crypto');
const JsonBigInt = require('json-bigint');

const { SERVICE } = require('./constants');

class Message {
  constructor({
    command,
    origin,
    destination,
    data = {},
    ack = false,
    requestId = randomBytes(32).toString('hex'),
  }) {
    this.command = command;
    this.data = data;
    this.origin = origin;
    this.destination = destination;
    this.ack = ack;
    this.requestId = requestId;
  }

  toJSON() {
    return JsonBigInt.stringify({
      command: this.command,
      data: this.data,
      origin: this.origin,
      destination: this.destination,
      ack: this.ack,
      request_id: this.requestId,
    });
  }

  static fromJSON(json) {
    const request = JsonBigInt.parse(json);

    return new Message({
      command: request.command,
      data: request.data,
      origin: request.origin,
      destination: request.destination,
      ack: request.ack,
      requestId: request.request_id,
    });
  }

  static registerService({ serviceName }) {
    return new Message({
      command: 'register_service',
      data: { service: serviceName },
      destination: SERVICE.daemon,
      origin: serviceName,
    });
  }
}

module.exports = Message;
