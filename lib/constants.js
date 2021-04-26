const SERVICE = {
  daemon: 'daemon',
  fullNode: 'chia_full_node',
  farmer: 'chia_farmer',
  harvester: 'chia_harvester',
  wallet: 'chia_wallet',
  walletUi: 'wallet_ui',
  plotter: 'chia plots create',
};
const SERVICE_TYPE = {
  fullNode: 1,
  harvester: 2,
  farmer: 3,
  timelord: 4,
  introducer: 4,
  wallet: 6,
};
const PLOTTING_STATE = {
  queued: 'SUBMITTED',
  running: 'RUNNING',
  error: 'ERROR',
  deleted: 'DELETED',
  finished: 'FINISHED',
};

module.exports = {
  SERVICE,
  SERVICE_TYPE,
  PLOTTING_STATE,
};
