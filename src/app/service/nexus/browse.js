'user strict';

const DummyTaskService = require('../dummy-task');


exports.createTaskId = function(nx_module) {
  return `load-version-info:${nx_module.id}`;
};


 function loadVersionInfo(nx_module) {

    let taskId = exports.createTaskId(nx_module);

    return DummyTaskService.submitTask({
      "id"    : taskId,
      "type"  : "load-nx-module-version",
      "input" : nx_module
    })
    .promise
    .then(result => {
      DummyTaskService.deleteTaskFromStore(taskId);
      return result;
    })
    .catch(err => {
      DummyTaskService.deleteTaskFromStore(taskId);
      throw err;
    });
}

exports.loadVersionInfo = loadVersionInfo;
