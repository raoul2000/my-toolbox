"use strict";

const NodeSSH = require('node-ssh');
const Entities = require('./entities');
const Descriptor = require('./descriptor');
const TCConfig = require('./tc-config');
const extractInstallDir = require('./tc-install-dir').extractInstallDir;
const PromiseUtil = require('../promise-utils');

function throwExceptionOnError( result ) {
  if( result.error) {
    throw result.error;
  }
}

/**
 * options = {
 *  "ssh" : Object NodeSSH valid and connected,
 *  "tomcatId" : "ID1" // the tomcat id to scan
 *  "entities" : object // key/value pair for XML entities
 * }
 *
 * Return = (see finalResult)
 *
 * @param  {object} options scan options
 * @return {Promise}
 */
function scanTomcat(options) {
  console.log("starting scan for :", options.tomcatId);
  let finalResult = {
    "id" : options.tomcatId,
    "installFolderPath" : null,
    "port" : null,
    "webapps" : []
  };
  return extractInstallDir({
    "ssh"    : options.ssh, // opened ssh connection
    "tomcat" : { "id" : options.tomcatId}
  })
  .then( result => {
    console.log("extractInstallDir returned",result);
    finalResult.installFolderPath = result.installDir;
    return TCConfig.getConfig({
      "ssh"              : options.ssh,
      "tomcatId"         : options.tomcatId,
      "tomcatInstallDir" : result.installDir,
      "xmlEntities"      : options.entities
    });
  })
  .then( result => {
    console.log("getConfig returned",result);
    finalResult.port = result.connector.port;

    let tasks = [];
    result.contextList.forEach( confItem => {
      confItem.context.forEach( context => {
        let descriptorFilePath = `${context.docBase}/WEB-INF/web.xml`;

        finalResult.webapps.push({
          "contextPath"        : context.path,
          "descriptorFilePath" : descriptorFilePath,
          "servlets"           : []
        });

        tasks.push({
          "ssh"            : options.ssh,
          "descriptorPath" : descriptorFilePath,
          "xmlEntities"    : options.entities
        });
      });
    });
    return PromiseUtil.serial(tasks, Descriptor.getAllServlet);
  })
  .then( results => {
    console.log("getAllServlet returned", results);

    // merge final results

    results
    .filter( result => result.resolved && ! result.error)
    .forEach( result => {
      let webapp = finalResult.webapps.find( webapp => webapp.descriptorFilePath === result.value.descriptorPath);
      if( webapp) {
        let updatedServlets = webapp.servlets.concat(result.value.servlets);
        webapp.servlets = updatedServlets;
      }
    });
    console.log("finalResult",finalResult);
    return finalResult;
  });

}


/**
 * Perform tomcat scan on the provided server.
 * options : {
 *  ssh : {
 *    host : 127.0.0.1,
 *    usernamme : "root"
 *    password : "root",
 *    port : 22
 *  },
 *  tomcats : [
 *    { id : "ID1" }
 *  ]
 * }
 * @param  {object} options scan options (see comment)
 * @return {Promise}         Resolved when the scan is done. Rejected on connection failure
 */
exports.run = function(options) {
  let entities = {};
  let ssh = new NodeSSH();
  return ssh.connect(options.ssh)
  .then( () => Entities.getEntities(ssh) )
  .then( entities => {
    let tasks = options.tomcats.map( tomcat => {
      return {
        "ssh" : ssh,
        "tomcatId" : tomcat.id,
        "entities" : entities
      };
    });
    return PromiseUtil.serial(tasks, scanTomcat);
  })
  .then( result => {
    ssh.dispose();
    return result;
  })
  .catch( err => {
    ssh.dispose();
    console.error(err);
  });
};
