const { randomBytes } = require('crypto');
const JsonBigInt = require('json-bigint');

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
}

module.exports = Message;
