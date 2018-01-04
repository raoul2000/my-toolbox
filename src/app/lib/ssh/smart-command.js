'use strict';

const NodeSSH = require('node-ssh');

function parseStdout(stdout, type) {
  let actualType = type || ( stdout.lastIndexOf('\n') === -1 ? "string" : "list");
  let parsedResult = null;
  //console.log("actualType = ",actualType);
  if( actualType === "list") {
    parsedResult = stdout
      .split('\n')
      .map( item => item.trim())
      .filter( item => item.length !== 0);
  } else if( actualType === 'string'){
    parsedResult = stdout;
  } else {
    throw new Error('unsupported result type : '+actualType);
  }
  return parsedResult;
}

/** -----------------------------------------------------------------
 * options :
 * {
 *    'command' : "set -o pipefail; ls -d -- tomcat/ | cut -d etc ....",
 *    'resultType' : "single" | "list"
  * }
 */
exports.run = function(nodessh, options) {
  return nodessh.execCommand(options.command,[],{stream: 'stdout'})
  .then(( commandResult ) => {
    commandResult.value = parseStdout(commandResult.stdout, options.resultType);
    return commandResult;
  });
};
