const { fork } = require('child_process');

const spawnBackgroundWorker = async () => {
  const forked = fork(`${__dirname}/../bin/scripterra-worker.js`, [], {
    cwd: process.cwd(),
    detached: true
  });

  return forked.pid;
};

module.exports = {
  spawnBackgroundWorker
}