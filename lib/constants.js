const SERVICE = {
  daemon: 'daemon',
  fullNode: 'chia_full_node',
  farmer: 'chia_farmer',
  harvester: 'chia_harvester',
  wallet: 'chia_wallet',
  walletUi: 'wallet_ui',
};
const SERVICE_TYPE = {
  fullNode: 1,
  harvester: 2,
  farmer: 3,
  timelord: 4,
  introducer: 5,
  wallet: 6,
};

module.exports = {
  SERVICE,
  SERVICE_TYPE,
};
