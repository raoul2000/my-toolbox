'use strict';

const NodeSSH = require('node-ssh');

function parseStdout(stdout, type) {
  let actualType = type || ( stdout.lastIndexOf('\n') === -1 ? "single" : "list");
  let parsedResult = stdout;
  console.log("actualType = ",actualType);
  if( actualType === "list") {
    parsedResult = stdout
      .split('\n')
      .map( item => item.trim())
      .filter( item => item.length !== 0);
  } else {
    throw new Error('unsupported result type : '+actualType);
  }
  return parsedResult;
}

/** -----------------------------------------------------------------
 * options :
 * {
 *    ssh : {
 *      'host' : '127.0.0.1',
 *      'port' : 22,
 *      'username' : 'user',
 *      'password' : '*****'
 *    },
 *    'command' : "set -o pipefail; ls -d -- tomcat/ | cut -d etc ....",
 *    'resultType' : "single" | "list"
  * }
 */
exports.run = function(options) {
  let ssh = new NodeSSH();
  return ssh
    .connect(options.ssh)
    .then(() => {
      console.log('bip');
      return ssh.execCommand(options.command,[],{stream: 'stdout'});
    })
    .then(( commandResult ) => {
      ssh.dispose();
      commandResult.value = parseStdout(commandResult.stdout, options.resultType);
      return commandResult;
    })
    .catch(err => {
      ssh.dispose();
      throw new Error(err);
    }
  );
};
