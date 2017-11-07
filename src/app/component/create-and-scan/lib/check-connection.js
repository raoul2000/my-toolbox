"use strict";

const NodeSSH = require('node-ssh');

/**
 * Checks that the SSH connection is valid.
 * This function tries to open a SSH connection using the provided arguments
 *
 * options :
 * {
 *    'host' : '127.0.0.1',
 *    'port' : 22,
 *    'username' : 'user',
 *    'password' : '*****'
 * }
 *
 * The SSH connection is released at the end.
 * 
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
    throw new Error(err);
  });
};
