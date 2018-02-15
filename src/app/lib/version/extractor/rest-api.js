"use strict";

/**
 * Returns the version number from a json obect, using the property 'version'
 * @param  {string} data JSON string
 * @return {string}      the extracted value
 */
exports.extract = function(data) {
  let jsonData = JSON.parse(data);
  return jsonData.version;
};
