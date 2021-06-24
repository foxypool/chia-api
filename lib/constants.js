let COIN = 'chia';

const SERVICE = {
  daemon: 'daemon',
  fullNode: `${COIN}_full_node`,
  farmer: `${COIN}_farmer`,
  harvester: `${COIN}_harvester`,
  wallet: `${COIN}_wallet`,
  walletUi: 'wallet_ui',
  plotter: `${COIN} plots create`,
};
const SERVICE_TYPE = {
  fullNode: 1,
  harvester: 2,
  farmer: 3,
  timelord: 4,
  introducer: 5,
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
  setCoin: (coin) => COIN = coin,
};
