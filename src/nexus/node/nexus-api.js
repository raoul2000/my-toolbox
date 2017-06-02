"use strict";

var request = require('request');
var Q = require('q');

/**
 * Extract the war file descriptor from the modVersionUrl.
 * The war file is found based on following rules :
 * - must be leaf
 * - must end with '.war'
 * The returned descriptor :
 *
 *     {
 *      "resourceURI": "http://hostname:8080/nexus/service/release/moduleName/2.3.19/filename.war",
 *      "relativePath": "/service/release/moduleName/2.3.19/filename.war",
 *      "text": "filename.war",
 *      "leaf": true,
 *      "lastModified": "2013-10-15 10:27:00.0 UTC",
 *      "sizeOnDisk": 334456
 *    }
 * @param  {string} modVersionUrl url of the version folder for a given module
 * @return {object}               war file descriptor
 */
exports.getWarfileDescriptor = function( modVersionUrl ) {

  return Q.Promise(function(resolve, reject, notify){
    request({
      url : modVersionUrl,
      headers : {
        'Accept' : ' application/json'
      }
    }, function(error, response, body){
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      if( error ) {
        reject(error);
      } else if (response && response.statusCode !== 200) {
        reject({message : "the URL " + modVersionUrl+ " could not be reached"});
      } else {
        let items = JSON.parse(body);
        let foundItem = items.data.find(function(element){
          return element.leaf === true && element.text.toUpperCase().endsWith('.WAR');
        });
        console.log("foundItem",foundItem);
        resolve(foundItem);
      }
    });

  }); //promise
};
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
      },
      timeout : 5000
    },
    function(error, response, body) {
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
      },
        timeout : 5000
    },
     function(error, response, body) {
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
