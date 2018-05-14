'user strict';

const DummyTaskService = require('../dummy-task');

/**
 * create a unique task id a check connection task from the provided SSH connection
 * parameters (see exports.checkConnection )
 *
 * @param  {object} ssh SSH connection settings
 * @return {string}        the unique task id
 */
exports.createTaskId = function(ssh) {
  return `check-ssh-connection:${ssh.username}@${ssh.host}`;
};

/**
 * Entry point to update version of a tomcat instance.
 *
 * options :
 * {
 *    'host' : '127.0.0.1',
 *    'port' : 22,
 *    'username' : 'user',
 *    'password' : '*****'
 * }
 * @param  {object} itemData a desktop item data instance
 * @param  {string} tomcatId the id of the tomcat to update
 * @param  {object} nodessh  an optional nodessh instance
 * @return {Promise}
 */
 function checkConnection(sshConnectionSettings) {

    let taskId = exports.createTaskId(sshConnectionSettings);

    return DummyTaskService.submitTask({
      "id"    : taskId,
      "type"  : "check-ssh-connection",
      "input" : sshConnectionSettings
    })
    .promise;
}

exports.checkConnection = checkConnection;
