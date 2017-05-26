"use strict";

var request = require('request');
var Q = require('q');

/**
 * Get module description.
 * Performs 2 requests to the maven repo : one for release and one for snapshot information
 * for a module
 *
 * module = {
 *  id : "the module Id",
 *  url : {
 *    release : "http://module/release",
 *    snapshot : "http://module/snapshot"
 *    }
 * }
 *
 * @param  {object} module object describing the module to retrieve
 * @return {object}        the module info
 */
exports.fetchModuleVersion = function(module) {

  let reqRelease =  Q.Promise(function(resolve, reject, notify){
    request({
      url : module.url.release,
      headers : {
        'Accept' : ' application/json'
      }
    }, function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      if(error || (response && response.statusCode !== 200)) {
        reject(error);
      } else {
        resolve({
          "type" : "release",
          "body" : body
        });
      }
    });
  });

  let reqSnapshot = Q.Promise(function(resolve, reject, notify){
    request({
      url : module.url.snapshot,
      headers : {
        'Accept' : ' application/json'
      }
    }, function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      if(error || (response && response.statusCode !== 200)) {
        reject(error);
      } else {
        resolve({
          "type" : "snapshot",
          "body" : body
        });
      }
    });
  });

  return Q.allSettled([ reqRelease, reqSnapshot])
  .then(function(results){
    console.log("results : ");
    console.log(results);
    let final = {
      "moduleId" : module.id
    };
    results.forEach(function(result){
      if(result.state === 'fulfilled') {
        final[result.value.type] = JSON.parse(result.value.body);
      } 
    });
    console.log(final);
    return final;
  });
};
