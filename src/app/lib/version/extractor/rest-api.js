"use strict";


exports.extract = function(data) {
  let jsonData = JSON.parse(data);
  return jsonData.version;
};
