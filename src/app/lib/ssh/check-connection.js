"use strict";

const NodeSSH = require('node-ssh');

/**
 * options :
 * {
 *    'host' : '127.0.0.1',
 *    'port' : 22,
 *    'username' : 'user',
 *    'password' : '*****'
 * }
 * @param  {Object} options SSH connection settings
 * @return {Promise}
 */
exports.checkConnection = function(options) {
  let ssh = new NodeSSH();
  return ssh.connect(options)
  .then(() => ssh.dispose())
  .catch(err => {
    console.error(err);
    ssh.dispose();
    throw err.message;
  });
};
