'use strict';

var request = require('request-promise-native');

/**
 * If not versionExtractor is provided, returns the command output.
 *
 * options : {
 *  "nodessh" : Node-SSH object,
 *  "command" : "...",
 *  "versionExtractor" : fn(body) {
 *    return "1.0.2";
 *  }
 * }
 * @param  {Object} options get version options
 * @return {Promise}
 */
exports.getVersion = function(options) {
  return options.nodessh.execCommand(options.command,[],{stream: 'stdout'})
  .then(( commandResult ) => {
    console.log(commandResult);
    return options.versionExtractor ? options.versionExtractor(commandResult.stdout) : commandResult.stdout;
  });
};
