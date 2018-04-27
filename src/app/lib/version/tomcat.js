"use strict";

const sshCommand  = require('./ssh-command');
const httpRequest = require('./http-request');
const asyncUtil = require('async');

/**
 * Extract Tomcat version using the embed TOMCAT_INSTALL/bin/version.sh script.
 *
 * The tomcat install path is copied from options.installFolderPath if available, or
 * created using the options.tomcat.id property using the following pattern :
 * - ./tomcat-[TOMCAT_ID]
 *
 * @param  {object} options see getVersion
 * @return {Promise}         Promise Result
 */
function ssh_from_version_script(options) {
  console.log('strategy : ssh_from_version_script');

  // is applicable
  if( ! options.nodessh ) {
    throw new Error("not applicable : missing nodessh");
  }

  if( (! options.tomcat || ! options.tomcat.id) && ! options.installFolderPath ) {
    throw new Error("not applicable : tomcat.id or installFolderPath must be provided");
  }

  // strategy is applicable
  let installFolderPath =  options.tomcat.installFolderPath
    ? options.tomcat.installFolderPath
    : `./tomcat-${options.tomcat.id.toLowerCase()}`;

  return sshCommand.getVersion(
    {
      "nodessh" : options.nodessh,
      "command" : `. .bash_profile && \
        ${installFolderPath}/bin/version.sh \
        | grep "Server version" \
        | cut -d ':' -f 2 \
        | cut -d '/' -f 2`
    }
  );
}

/**
 * Extract Tomcat version using the org.apache.catalina.util.ServerInfo static method
 * from TOMCAT_INSTALL/lib/catalina.jar.
 *
 * The tomcat install path is copied from options.installFolderPath if available, or
 * created using the options.tomcat.id property using the following pattern :
 * - ./tomcat-[TOMCAT_ID]
 *
 * @param  {object} options see getVersion
 * @return {Promise}         Promise Result
 */
function ssh_from_catalina_jar(options) {
  console.log('strategy : ssh_from_catalina_jar');

  // is applicable
  if( ! options.nodessh ) {
    throw new Error("not applicable : missing nodessh");
  }

  if( (! options.tomcat || ! options.tomcat.id) && ! options.installFolderPath ) {
    throw new Error("not applicable : tomcat.id or installFolderPath must be provided");
  }

  // strategy is applicable
  let installFolderPath =  options.tomcat.installFolderPath
    ? options.tomcat.installFolderPath
    : `./tomcat-${options.tomcat.id}`;

  return sshCommand.getVersion(
    {
      "nodessh" : options.nodessh,
      "command" : `. .bash_profile && \
      java -cp ${installFolderPath}/lib/catalina.jar org.apache.catalina.util.ServerInfo \
      | head -n 1 \
      | cut -d ':' -f 2 \
      | cut -d '/' -f 2`
    }
  );
}

// TODO : this does not work because if HTTP 404 is returned, the Promise
// is considered as having failed.
function http_manager_404(options) {
  console.log('strategy : http_manager_404');

  // is applicable
  if( ! options.tomcat || ! options.tomcat.ip || ! options.tomcat.port) {
    throw new Error("not applicable : missing tomcat.ip or tomcat.port");
  }

  return httpRequest.getVersion({
    "url" : `http://${options.tomcat.ip}:${options.tomcat.port}/manager/notFound`,
    "versionExtractor" : require('./extractor/regex')
  });
}
/**
 * Extract the tomcat version using various strategies
 *
 * options : {
 *  "nodessh" : NodeSSH, // optional
 *  "tomcat" : {
 *    "id" : "core",      // optional if installFolderPath is provided
 *    "ip" : "127.0.0.1", // optional
 *    "port" : 3214,
 *    "installFolderPath" : "/path/to/tomcat", // optional
 *  }
 * }
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.getVersion = function(options) {

  let extractionStrategies = [
    ssh_from_catalina_jar,
    ssh_from_version_script
    //http_manager_404
  ];

  let tasks = extractionStrategies.map( extractionFn => {
    return asyncUtil.reflect( (cb) => {
      extractionFn(options)
      .then (result => { cb(null, result);})
      .catch(error  => { cb(error);       });
    });
  });

  return new Promise( (resolve, reject) => {
    asyncUtil.series(tasks, (err, results) => {
      if(err) { reject(err);     }
      else    { resolve(results);}
    });
  });
};
