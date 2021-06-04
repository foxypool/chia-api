const Base = require('./base');
const Message = require('../message');
const { SERVICE } = require('../constants');

const BACKUP_HOST = 'https://backup.chia.net';

class Wallet extends Base {
  get destination() {
    return SERVICE.wallet;
  }

  async getBalance({ walletId }) {
    const res = await this.connection.send(new Message({
      command: 'get_wallet_balance',
      data: { wallet_id: walletId },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.wallet_balance;
  }

  async getWallets() {
    const res = await this.connection.send(new Message({
      command: 'get_wallets',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.wallets;
  }

  async getWallet() {
    const wallets = await this.getWallets();
    if (wallets.length === 0) {
      throw new Error('No wallets defined');
    }

    return wallets[0];
  }

  async getWalletSyncedHeight() {
    const res = await this.connection.send(new Message({
      command: 'get_height_info',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.height;
  }

  async getWalletSyncStatus() {
    const res = await this.connection.send(new Message({
      command: 'get_sync_status',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }

  async getPrivateKey({ fingerprint }) {
    const res = await this.connection.send(new Message({
      command: 'get_private_key',
      data: { fingerprint },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.private_key;
  }

  async getPublicKeys() {
    const res = await this.connection.send(new Message({
      command: 'get_public_keys',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.public_key_fingerprints;
  }

  async getPublicKey() {
    const publicKeys = await this.getPublicKeys();
    if (publicKeys.length === 0) {
      throw new Error('Wallet is missing the public keys');
    }

    return publicKeys[0];
  }

  async sendTransaction({ walletId, address, amount, fee }) {
    const res = await this.connection.send(new Message({
      command: 'send_transaction',
      data: {
        wallet_id: walletId,
        address,
        amount,
        fee,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.transaction;
  }

  async sendMultiTransaction({ walletId, puzzleHashAmountPairs, fee }) {
    const additions = Object.keys(puzzleHashAmountPairs).map(puzzleHash => ({
      puzzle_hash: puzzleHash,
      amount: puzzleHashAmountPairs[puzzleHash],
    }));

    const res = await this.connection.send(new Message({
      command: 'send_transaction_multi',
      data: {
        wallet_id: walletId,
        additions,
        fee,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.transaction;
  }

  async getFarmedAmount() {
    const res = await this.connection.send(new Message({
      command: 'get_farmed_amount',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }

  async logInAndSkip({ fingerprint }) {
    const res = await this.connection.send(new Message({
      command: 'log_in',
      data: {
        fingerprint,
        type: 'skip',
        host: BACKUP_HOST,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data;
  }
}

module.exports = Wallet;
