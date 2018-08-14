'user strict';

const DummyTaskService = require('./dummy-task');
const uuidv1           = require('uuid/v1');

/**
 * create a unique task id 
 */
function createTaskId() {
  return `load-entities:${uuidv1()}`;
};

/**
 * Note that if the password is encrypted, it will be automatically decrypted before
 * server submition.
 * 
 * options :
 * ```
  {
    'host'     : '127.0.0.1',
    'port'     : 22,
    'username' : 'user',
    'password' : '*****'
  }
  ```
 * @param  {object} sshConnectionSettings SSH connection settings
 * @return {Promise}
 */
 function loadFromServer(ssh, taskId) {

   if( taskId ) {
     // if a taskId is provided by caller, make sure it is not already 
     // present in the task list
      DummyTaskService.deleteTaskFromStore(taskId);
      actualTaskId = taskId;
   } else {
      actualTaskId = createTaskId();
   }
   
    return DummyTaskService.submitTask({
        "id"    : actualTaskId,
        "type"  : "load-entities",
        "input" : ssh
    })
    .promise;
}


module.exports = {
    "loadFromServer" : loadFromServer,
    "createTaskId" : createTaskId
  };