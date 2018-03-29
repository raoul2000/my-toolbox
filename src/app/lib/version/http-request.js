'use strict';

var request = require('request-promise-native');

/**
 * If not versionExtractor is provided, returns the response body.
 *
 * options : {
 *  "url" : "http://hostname/path",
 *  "versionExtractor" : fn(body) {
 *    return "1.0.2";
 *  }
 * }
 * @param  {Object} options get version options
 * @return {Promise}
 */
exports.getVersion = function(options) {
  return request(options.url)
    .then(function (htmlString) {
        return options.versionExtractor ? options.versionExtractor.extract(htmlString) : htmlString;
    });
};
