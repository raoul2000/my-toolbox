"use strict";

const request = require('request-promise-native');
const asyncUtil = require('async');


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
  return request({
    url     : module.url.release,
    headers : {'Accept' : ' application/json'},
    timeout : 5000,
    json    : true
  })
  .then( result => {
    /*
    // folder Example
    {
      "resourceURI": "http://10.3.4.117:8080/nexus/content/repositories/public/com/eidosmedia/webapp/preview/previewjsp/",
      "relativePath": "/repositories/public/com/eidosmedia/webapp/preview/previewjsp/",
      "text": "previewjsp",
      "leaf": false,
      "lastModified": "2018-03-24 03:37:19.0 UTC",
      "sizeOnDisk": -1
    }


    // File example
    {
      "resourceURI": "http://10.3.4.117:8080/nexus/content/repositories/public/com/eidosmedia/webapp/preview/maven-metadata.xml",
      "relativePath": "/repositories/public/com/eidosmedia/webapp/preview/maven-metadata.xml",
      "text": "maven-metadata.xml",
      "leaf": true,
      "lastModified": "2018-05-09 15:40:15.0 UTC",
      "sizeOnDisk": 1114
    }
    */

    return result.data;
  });
};

exports.fetchModuleVersion_old = function(module) {

  let tasks = [
    { "url" : module.url.release,  "type" : "release"  },
    { "url" : module.url.snapshot, "type" : "snapshot" }
  ]
  .map( task => {
    return function(cb) {
      request({
          url     : task.url,
          headers : {'Accept' : ' application/json'},
          timeout : 5000
        })
        .then( result => {
          console.log(result);
           cb(null,{
          "type" : task.type,
          "body" : result.data
        })})
        .catch(err    => { console.error(err); cb(err);});
      };
  });

  return new Promise( (resolve,reject) => {
    let allDone =  function(err, results) {
      let finalResult = {  "moduleId" : module.id};
      results.forEach( (result) => {
          finalResult[result.value.type] = JSON.parse(result.value.body);
      });
      resolve(finalResult);
    };
    asyncUtil.parallel( asyncUtil.reflectAll(tasks),allDone);
  });
};
