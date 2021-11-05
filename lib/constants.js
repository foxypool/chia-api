const SERVICE = (coin = 'chia') => {
  return {
    daemon: 'daemon',
    fullNode: `${coin}_full_node`,
    farmer: `${coin}_farmer`,
    harvester: `${coin}_harvester`,
    wallet: `${coin}_wallet`,
    walletUi: 'wallet_ui',
    plotter: `${coin}_plotter`,
  };
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
  removing: 'REMOVING',
  finished: 'FINISHED',
};

module.exports = {
  SERVICE,
  SERVICE_TYPE,
  PLOTTING_STATE,
};
