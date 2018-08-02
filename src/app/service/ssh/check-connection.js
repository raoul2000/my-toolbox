'user strict';

const DummyTaskService = require('../dummy-task');
const secret = require('../../lib/lib').secret;

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
 * Note that if the password is encrypted, it will be automatically decrypted before
 * server submition.
 * 
 * options :
 * ```
  {
    'host' : '127.0.0.1',
    'port' : 22,
    'username' : 'user',
    'password' : '*****'
  }
  ```
 * @param  {object} sshConnectionSettings SSH connection settings
 * @return {Promise}
 */
 function checkConnection(sshConnectionSettings) {

    return DummyTaskService.submitTask({
      "id"    : exports.createTaskId(sshConnectionSettings),
      "type"  : "check-ssh-connection",
      "input" : secret.decryptPassword(sshConnectionSettings)
    })
    .promise;
}

exports.checkConnection = checkConnection;
