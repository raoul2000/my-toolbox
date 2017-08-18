"use strict";

var xmlParser = require('./helper/xml-parser'),
    waterfall = require("promise-waterfall");

/**
 * Extract context informations from a tomcat server configuration XML string passed as argument.
 * Note that the XML string must NOT contain unresolved entities.
 * This function returns an array of object describing the @path and @docBase attributes.
 * Example :
 * [
 * 	{'path':'/path, 'docBase' : '/doc/base/path'},
 * 	{'path':'/path, 'docBase' : '/doc/base/path'}
 * ]
 *
 * @param  {dom} Document
 * @return {array}      list of contexts
 */
function getContextsFromDOM(dom) {

  console.log("getContextsFromDOM", dom);
  var contexts = [];
  var contextList = dom.getElementsByTagName("Context");
  for(var i=0; i<contextList.length; i ++) {
    contexts.push({
      'path'    : contextList[i].getAttribute('path'),
      'docBase' : contextList[i].getAttribute('docBase')
    });
  }
  console.log("getContextsFromDOM", contexts);
  return contexts;
}
exports.getContextsFromDOM = getContextsFromDOM;

/**
 * Create a list of context from a file.
 * Returns an object with following properties :
 * Example :
 * {
 *  file : the value of the filepath argument
 *  contexts : [
 *    {'path':'/path, 'docBase' : '/doc/base/path'},
 *    {'path':'/path, 'docBase' : '/doc/base/path'},
 *    {'path':'/path, 'docBase' : '/doc/base/path'}
 *  ]
 * }
 *
 *
 * @param  {object} conn        connection settings
 * @param  {string} filePath    absolute path to the file to analyze
 * @param  {object} xmlEntities hash where keys  are entities names and value are entity values
 * @return {object}             Promisifies result
 */
function getContextsFromFile(ssh, filePath, xmlEntities) {
  console.log("getContextsFromFile", filePath);
  var cmd = `cat ${filePath}`;
  return ssh.execCommand(cmd, { stream : 'stdout'})
  .then(result => {
    console.log("getContextsFromFile", result);
    return xmlParser.parse(result.stdout, xmlEntities);
  })
  .then( ctxDOM => getContextsFromDOM(ctxDOM) );
}
exports.getContextsFromFile = getContextsFromFile;

/**
 * Load context from files located in a folder.
 * Returns an Array containing extracted contexts for each file in the folder.
 * (see getContextsFromFile)
 *
 * @param  {object} conn        connection settings
 * @param  {string} filePath    absolute path to the file to analyze
 * @param  {object} xmlEntities hash where keys  are entities names and value are entity values
 * @return {object}             Promisifies result
 */
function getContextsFromFolder(ssh, folderPath, xmlEntities) {

  var cmd = `ls ${folderPath}/*.xml`;
  var ctx = [];

  return ssh.execCommand(cmd, { stream : 'stdout'})
  .then( result => {
    console.log("getContextsFromFolder", result);
    return waterfall(
      result.stdout
      .split('\n')
      .filter(function(filePath){
        return filePath && filePath.length !== 0;
      })
      .map( filePath => {
        return function() {
          console.log("getContextsFromFolder", filePath);
          return getContextsFromFile(ssh, filePath, xmlEntities)
          .then( result => {
            ctx.push({
              "filePath" : filePath,
              "context" : result
            });
          });
        };
      })
    )
    .then( () => ctx);
  });
}

exports.getContextsFromFolder = getContextsFromFolder;
/**
 * Returns :
 * [
 *  {
 *    "filePath" : "context file path",
 *    "context"  : [
 *      { docBase : " ..", path : "..." }, ...
 *    ]
 *  }
 * ]
 * @param  {[type]} ssh              [description]
 * @param  {[type]} tomcatInstallDir [description]
 * @param  {[type]} xmlEntities      [description]
 * @return {Promise}                  [description]
 */
function getContextsFromTomcatDir(ssh, tomcatInstallDir, xmlEntities) {
  var contextList = [];

  return getContextsFromFile(ssh, tomcatInstallDir + '/conf/server.xml', xmlEntities)
  .then(function(result){
    console.log( "getContextsFromTomcatDir", result);
    if( result && result.length !== 0) {
      contextList.push(result);
    } // else : no context found in server.xml
    return getContextsFromFolder(ssh, tomcatInstallDir +  '/conf/Catalina/localhost', xmlEntities);
  })
  .then(function(result){
    //console.log( "getContextsFromTomcatDir", result);
    return contextList.concat(result);
  });

}
exports.getContextsFromTomcatDir = getContextsFromTomcatDir;
