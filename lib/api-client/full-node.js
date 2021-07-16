const Base = require('./base');
const Message = require('../message');
const { SERVICE } = require('../constants');

class FullNode extends Base {
  get destination() {
    return SERVICE(this.connection.coin).fullNode;
  }

  onNewBlockchainState(cb) {
    this.connection.onMessage(message => {
      if (message.command !== 'get_blockchain_state') {
        return;
      }
      cb(message.data.blockchain_state);
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

  async getRecentSignagePoint({ signagePointHash }) {
    const res = await this.connection.send(new Message({
      command: 'get_recent_signage_point_or_eos',
      data: { sp_hash: signagePointHash },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }

  async getRecentEndOfSubSlot({ signagePointHash }) {
    const res = await this.connection.send(new Message({
      command: 'get_recent_signage_point_or_eos',
      data: { challenge_hash: signagePointHash },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }

  async getCoinRecordByName({ name }) {
    const res = await this.connection.send(new Message({
      command: 'get_coin_record_by_name',
      data: { name },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.coin_record;
  }

  async getCoinRecordsByPuzzleHashes({
    puzzleHashes,
    startHeight,
    endHeight,
    includeSpentCoins,
  }) {
    const requestData = { puzzle_hashes: puzzleHashes };
    if (startHeight) {
      requestData.start_height = startHeight;
    }
    if (endHeight) {
      requestData.end_height = endHeight;
    }
    if (includeSpentCoins !== undefined) {
      requestData.include_spent_coins = !!includeSpentCoins;
    }

    const res = await this.connection.send(new Message({
      command: 'get_coin_records_by_puzzle_hashes',
      data: requestData,
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.coin_records;
  }

  async getCoinRecordsByPuzzleHash({
    puzzleHash,
    startHeight,
    endHeight,
    includeSpentCoins,
  }) {
    const requestData = { puzzle_hash: puzzleHash };
    if (startHeight) {
      requestData.start_height = startHeight;
    }
    if (endHeight) {
      requestData.end_height = endHeight;
    }
    if (includeSpentCoins !== undefined) {
      requestData.include_spent_coins = !!includeSpentCoins;
    }

    const res = await this.connection.send(new Message({
      command: 'get_coin_records_by_puzzle_hash',
      data: requestData,
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.coin_records;
  }

  async getCoinSolution({
    coinId,
    height,
  }) {
    const res = await this.connection.send(new Message({
      command: 'get_puzzle_and_solution',
      data: {
        coin_id: coinId,
        height,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.coin_solution;
  }

  async pushTx({ spendBundle }) {
    const res = await this.connection.send(new Message({
      command: 'push_tx',
      data: { spend_bundle: spendBundle },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }
}

module.exports = FullNode;
