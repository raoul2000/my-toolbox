"use strict";

const lib     = require('../../../lib/lib');
const NodeSSH = require('node-ssh');


/**
 * Entry point to update version of a tomcat instance.
 *
 * @param  {object} itemData a desktop item data instance
 * @param  {string} tomcatId the id of the tomcat to update
 * @param  {object} nodessh  an optional nodessh instance
 * @return {Promise}
 */
 function updateTomcat(itemData, tomcatId, nodessh) {
    // find the tomcat object intance
    let tomcat = itemData.tomcats.find( tomcat => tomcat._id === tomcatId);
    if( ! tomcat ) {
      return Promise.reject(`tomcat not found : id = ${tomcatId}`);
    }

    // if no ssh connection object is provided, try to acquire one now
    let usePrivateSSH = false;
    if( ! nodessh ) {
        nodessh = new NodeSSH();
        usePrivateSSH = true;
    }

    // start the version extraction
    return nodessh.connect(itemData.ssh)
    .then( result => {
      return lib.version.tomcat.getVersion({
        "nodessh" : nodessh,
        "tomcat"  : {
          "id"                : tomcat.id,
          "ip"                : itemData.ssh.host,
          "port"              : tomcat.port,
          "installFolderPath" : tomcat.installFolderPath
        }
      });
    })
    .then( results => {
      if( nodessh && usePrivateSSH) {
        nodessh.dispose();
      }
      return results;
    })
    .catch(err => {
      console.error(err);
      if( nodessh && usePrivateSSH) {
        nodessh.dispose();
      }
      throw err;
    });
}


function run(task, notifyProgress) {
  let arg = task.input;
  return updateTomcat(arg.item,arg.tomcatId, arg.nodessh);
}

module.exports = {
  "run" : run
};
