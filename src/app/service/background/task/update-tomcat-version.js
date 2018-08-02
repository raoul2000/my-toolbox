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

    // if no SSH connection object is provided, try to acquire one now and open
    // connection
    let usePrivateSSH = false;
    let connect;
    if( ! nodessh ) {
        nodessh = new NodeSSH();
        usePrivateSSH = true;
        console.log(`SSH LOGIN : ${itemData.ssh.host}`);
        connect = nodessh.connect(lib.secret.decryptPassword(itemData.ssh));
    } else {
      connect = Promise.resolve(true);
    }

    let logoutSSH = function() {
      if( nodessh && usePrivateSSH) {
        console.log(`SSH LOGOUT : ${itemData.ssh.host}`);
        nodessh.dispose();
      }
    };

    // start the version extraction
    return connect
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
      logoutSSH();
      return results;
    })
    .catch(err => {
      console.error(err);
      logoutSSH();
      throw err;
    });
}

// Exports /////////////////////////////////////////////////////////////////////

module.exports = {
  "run"          : function(task, notifyProgress) {
    let arg = task.input;
    return updateTomcat(arg.item,arg.tomcatId, arg.nodessh);
  },
  "updateTomcat" : updateTomcat
};
