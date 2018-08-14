"use strict";

const lib     = require('../../../lib/lib');


function run(task, notifyProgress) {
    return lib.entities.loadFromServer(task.input)
}

module.exports = {
  "run" : run
};