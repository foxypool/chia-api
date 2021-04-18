const Base = require('./base');
const Message = require('../message');
const { SERVICE } = require('../constants');

class FullNode extends Base {
  get destination() {
    return SERVICE.fullNode;
  }

  onNewBlockchainState(cb) {
    this.connection.onMessage(message => {
      if (message.command !== 'get_blockchain_state') {
        return;
      }
      cb(message);
    });
  }

  async getBlockchainState() {
    const res = await this.connection.send(new Message({
      command: 'get_blockchain_state',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.blockchain_state;
  }

  async getBlock({ hash }) {
    const res = await this.connection.send(new Message({
      command: 'get_block',
      data: { header_hash: hash },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.block;
  }

  async getBlockByHeight({ height }) {
    const blocks = await this.getBlocks({ startBlockHeight: height, endBlockHeight: height + 1});
    if (blocks.length === 0) {
      throw new Error(`No block found for height ${height}`);
    }

    return blocks[0];
  }

  async getBlocks({ startBlockHeight, endBlockHeight }) {
    const res = await this.connection.send(new Message({
      command: 'get_blocks',
      data: {
        start: startBlockHeight,
        end: endBlockHeight,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.blocks;
  }

  async getUnfinishedBlockHeaders() {
    const res = await this.connection.send(new Message({
      command: 'get_unfinished_block_headers',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.headers;
  }

  async getNetworkSpace({ startBlockHash, endBlockHash }) {
    const res = await this.connection.send(new Message({
      command: 'get_network_space',
      data: {
        newer_block_header_hash: startBlockHash,
        older_block_header_hash: endBlockHash,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.space;
  }

  async getNetworkSpaceForHeights({ startHeight, endHeight }) {
    const startBlock = await this.getBlockByHeight({ height: startHeight });
    const endBlock = await this.getBlockByHeight({ height: endHeight });

    return this.getNetworkSpace({ startBlockHash: startBlock.header_hash, endBlockHash: endBlock.header_hash });
  }

  async getAverageNetworkSpaceForHeight(height) {
    return this.getNetworkSpaceForHeights({ startHeight: Math.max(1, height - 1000), endHeight: height });
  }
}

module.exports = FullNode;
