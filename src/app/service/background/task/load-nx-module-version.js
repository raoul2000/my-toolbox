"use strict";

const lib     = require('../../../lib/lib');

function run(task, notifyProgress) {
	return lib.nexus.browse.fetchModuleVersion(task.input);
}

module.exports = {
  "run" : run
};
