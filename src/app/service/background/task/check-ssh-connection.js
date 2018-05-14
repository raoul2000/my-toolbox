"use strict";

const lib = require('../../../lib/lib');

function run(task, notifyProgress) {
  return lib.ssh.checkConnection(task.input);
}

module.exports = {
  "run" : run
};
