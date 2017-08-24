"use strict";

var xmlParser = require('./helper/xml-parser');
var    waterfall = require("promise-waterfall");

/**
 * Parse an remote XML file into a DOM.
 *
 * @param  {object} ssh      SSH-2 object
 * @param  {string} filePath the remote file path to parse
 * @param  {hash} entities XML entities hask object
 * @return {promise}          Resvoled to the DOM
 */
function parseRemoteFile(ssh, remoteFilePath, xmlEntities) {

  var cmd = `cat ${remoteFilePath}`;
  return ssh.execCommand(cmd,{  stream: 'stdout' })
  .then(result => {
    console.log(result);
    return xmlParser.parse(result.stdout, xmlEntities);
  })
  .catch( err => {
    console.error(err);
  });
}
exports.parseRemoteFile = parseRemoteFile;


function getPortNumberByProtocol(dom, protocol) {
  var connectorList = dom.getElementsByTagName("Connector");
  for(var i=0; i<connectorList.length; i ++) {
    if( connectorList[i].getAttribute("protocol") === protocol ){
      return connectorList[i].getAttribute("port");
    }
  }
  return null;
}
exports.getPortNumberByProtocol = getPortNumberByProtocol;

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
  return Promise.resolve(contexts);
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
function getConfig(ssh, tomcatInstallDir, xmlEntities) {
  var tcConf = {
    contextList : []
  };
  var contextList = [];

  return parseRemoteFile(ssh, tomcatInstallDir + '/conf/server.xml', xmlEntities)
  .then( domConfig => {

    ////////////////////////////////////////////////////////////////////////////
    // from the Tomcat server.xml file retrieve :
    // - port
    // - contexts

    tcConf.connector = {
      "protocol" : "HTTP/1.1",
      "port" : getPortNumberByProtocol(domConfig, "HTTP/1.1")
    };
    return getContextsFromDOM(domConfig)  // get conetxts from server.xml
    .then( result => {
      if( result && result.length !== 0) {
        tcConf.contextList.push(result);
      } // else : no context found in server.xml
      return true;
    });
  })
  .then( () =>  getContextsFromFolder(ssh, tomcatInstallDir +  '/conf/Catalina/localhost', xmlEntities))
  .then(function(result){
    //console.log( "getContextsFromTomcatDir", result);
    tcConf.contextList = tcConf.contextList.concat(result);
    return tcConf;
  });
}
exports.getConfig = getConfig;
