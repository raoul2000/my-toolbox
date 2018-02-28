"use strict";

const xmlParser    = require('../xml/parser');
const promiseUtils = require('../promise-utils');

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
  .then( ctxDOM => ({
    "filePath" : filePath,
    "context"  : getContextsFromDOM(ctxDOM)
  }));
}
exports.getContextsFromFile = getContextsFromFile;

/**
 * Load context from files located in a folder.
 * Returns an Array containing extracted contexts for each file in the folder.
 * (see getContextsFromFile)
 *
 * example : [
 *  {
 *    "filePath" : "/path/to/context.xml",
 *    "context" : [
 *      {'path':'/path, 'docBase' : '/doc/base/path'},
 *      {'path':'/path, 'docBase' : '/doc/base/path'},
 *      {'path':'/path, 'docBase' : '/doc/base/path'}
 *    ]
 * },
 * {...}
 * ]
 *
 * @param  {object} conn        connection settings
 * @param  {string} filePath    absolute path to the file to analyze
 * @param  {object} xmlEntities hash where keys  are entities names and value are entity values
 * @return {object}             Promisifies result
 */
function getContextsFromFolder(ssh, folderPath, xmlEntities) {


  //let cmd = `ls ${folderPath}/*.xml`; // exit code !=0 is folder empty
  let cmd = `find "${folderPath}" -type f  -name "*.xml" -print`;
  var ctx = [];

  return ssh.execCommand(cmd, { stream : 'stdout'})
  .then( result => {
    console.log("getContextsFromFolder", result);
    if( result.code !== 0 ) {
      console.error(`failed to list context files - command : ${cmd} - error : ${result.stderr}`);
      return ctx;
    }
    // create one task option per filePath listed
    let filePathList = result.stdout
      .split('\n')
      .filter(function(filePath){
        return filePath && filePath.length !== 0; // skip empty lines
      });

    return promiseUtils.serial(filePathList, filePath => getContextsFromFile(ssh, filePath, xmlEntities))
      .then( results => {
        let finalResult = results
          .filter(result => result.resolved)
          .map( result => ({
            "filepath" : result.value.filePath,
            "context"  : result.value.context
          }));
        return finalResult;
      });
  });
}
exports.getContextsFromFolder = getContextsFromFolder;

/**
 * options = {
 *  ssh : Object NodeSSH instance,
 *  tomcatId : "ID1",
 *  tomcatInstallDir : "/folder/folder",
 *  xmlEntities : {
 *    ENTITY_NAME : "ENTITY_VALUE",
 *    ENTITY_NAME : "ENTITY_VALUE",
 *    etc...
 *  }
 * }
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
//function getConfig(ssh, tomcatInstallDir, xmlEntities) {
function getConfig(options) {

  let ssh = options.ssh;
  let tomcatInstallDir = options.tomcatInstallDir;
  let xmlEntities = options.xmlEntities;

  var tcConf = {
    tomcatId : options.tomcatId,
    contextList : []
  };
  var contextList = [];
  let serverConfigFilePath = `${tomcatInstallDir}/conf/server.xml`;

  return parseRemoteFile(ssh, serverConfigFilePath, xmlEntities)
  .then( domConfig => {

    ////////////////////////////////////////////////////////////////////////////
    // from the Tomcat server.xml file retrieve :
    // - port
    // - contexts

    tcConf.connector = {
      "protocol" : "HTTP/1.1",
      "port"     : getPortNumberByProtocol(domConfig, "HTTP/1.1")
    };
    let contexts = getContextsFromDOM(domConfig); // get conetxts from server.xml
    if(contexts && contexts.length !== 0) {
      tcConf.contextList.push({
        "filePath" : serverConfigFilePath,
        "context" : contexts
      });
    } // else : no context found in server.xml (sad)
    return true;
  })
  .then( () =>  getContextsFromFolder(ssh, tomcatInstallDir +  '/conf/Catalina/localhost', xmlEntities))
  .then(function(results){
    if( results.length !== 0 ) {
      let finalContextList = tcConf.contextList.concat(results);
      tcConf.contextList = finalContextList;
    }
    return tcConf;
  });
}
exports.getConfig = getConfig;
