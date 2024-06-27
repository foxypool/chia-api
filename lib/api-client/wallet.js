const Base = require('./base');
const Message = require('../message');
const { makeServiceNames } = require('../constants');

const BACKUP_HOST = 'https://backup.chia.net';

class Wallet extends Base {
  get destination() {
    return makeServiceNames(this.connection.coin).wallet;
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

  async createSignedTransaction({ additions, fee, coinAnnouncements = [], minCoinAmount = undefined, maxCoinAmount = undefined, excludedCoinAmounts = undefined, excludedCoinIds = undefined }) {
    const res = await this.connection.send(new Message({
      command: 'create_signed_transaction',
      data: {
        additions,
        fee,
        coin_announcements: coinAnnouncements,
        min_coin_amount: minCoinAmount,
        max_coin_amount: maxCoinAmount,
        excluded_coin_amounts: excludedCoinAmounts,
        excluded_coin_ids: excludedCoinIds,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.signed_tx;
  }

  async getTransactions({
    walletId,
    offset = 0,
    limit = 50,
    sortBy = undefined,
    sortDescending = true,
    toAddress = undefined,
  }) {
    const res = await this.connection.send(new Message({
      command: 'get_transactions',
      data: {
        wallet_id: walletId,
        start: offset,
        end: offset + limit,
        sort_key: sortBy,
        reverse: sortDescending,
        to_address: toAddress,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.transactions;
  }

  async getTransaction({ id }) {
    const res = await this.connection.send(new Message({
      command: 'get_transaction',
      data: { transaction_id: id },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.transaction;
  }

  async getNextAddress({ walletId, makeNewAddress = true }) {
    const res = await this.connection.send(new Message({
      command: 'get_next_address',
      data: {
        wallet_id: walletId,
        new_address: makeNewAddress,
      },
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.address;
  }

  async getLoggedInFingerprint() {
    const res = await this.connection.send(new Message({
      command: 'get_logged_in_fingerprint',
      origin: this.origin,
      destination: this.destination,
    }));

    return res.data.fingerprint;
  }

  async pushTx({ spendBundle }) {
    await this.connection.send(new Message({
      command: 'push_tx',
      data: { spend_bundle: spendBundle },
      origin: this.origin,
      destination: this.destination,
    }));
  }

  async selectCoins({amount, walletId, minCoinAmount = undefined, maxCoinAmount = undefined, excludedCoinAmounts = undefined, excludedCoinIds = undefined }) {
    const res = await this.connection.send(new Message({
      command: 'select_coins',
      data: {
        amount,
        wallet_id: walletId,
        min_coin_amount: minCoinAmount,
        max_coin_amount: maxCoinAmount,
        excluded_coin_amounts: excludedCoinAmounts,
        excluded_coin_ids: excludedCoinIds,
      },
      origin: this.origin,
      destination: this.destination,
    }))

    return res.data.coins
  }
}

module.exports = Wallet;
