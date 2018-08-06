'user strict';

const DummyTaskService = require('./dummy-task');


/**
 * create a unique task id a check connection task from the provided SSH connection
 * parameters (see exports.checkConnection )
 *
 * @param  {object} ssh SSH connection settings
 * @return {string}        the unique task id
 */
exports.createTaskId = function(tomcatId) {
  return `check-tomcat-alive:${tomcatId}`;
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
 function isAlive(itemData, tomcatId) {
    let tomcatToCheck = itemData.tomcats.find(tomcat => tomcat._id === tomcatId);
    if( tomcatToCheck) {
        return DummyTaskService.submitTask({
          "id"    : exports.createTaskId(tomcatId),
          "type"  : "check-tomcat-alive",
          "input" : `http://${itemData.ssh.host}:${tomcatToCheck.port}`
        })
        .promise;
    } else {
        return Promise.reject(`tomcat not found ( id = ${tomcatId})`);
    }
}

module.exports = {
    "isAlive" : isAlive
  };