"use strict";

const NodeSSH = require('node-ssh');
const updateTomcatVersion = require('./update-tomcat-version');
const asyncUtil = require('async');

/**
 * Entry point to update version of many tomcat instance.
 * Only one SSH connection is used to update in parallel all verison values.
 *
 * @param  {object} itemData a desktop item data instance
 * @param  {[string]} tomcatIds the ids of the tomcat to update
 * @param  {object} nodessh  an optional nodessh instance
 * @return {Promise}
 */
 function updateTomcatBatch(itemData, tomcatIds) {

    let nodessh = new NodeSSH();

    console.log(`SSH LOGIN : ${itemData.ssh.host}`);
    return nodessh.connect(itemData.ssh)
    .then( result => {
      let asyncFn = tomcatIds.map( tomcatId => {
        return function(cb){
          updateTomcatVersion.updateTomcat(itemData, tomcatId, nodessh)
          .then( result => {cb(null,{ "tomcatId" : tomcatId, "result" : result})})
          .catch(error  => {cb({"tomcatId" : tomcatId, "error" : error})});
        };
      });
      return new Promise( (resolve,reject)=> {
        asyncUtil.parallel(asyncFn,(err,results) => {
          console.log(`SSH LOGOUT : ${itemData.ssh.host}`);
          nodessh.dispose();
          if( err ) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    })
    .catch(err => {
      console.error(err);
      console.log(`SSH LOGOUT : ${itemData.ssh.host}`);
      nodessh.dispose();
    });
}

// Export //////////////////////////////////////////////////////////////////////

module.exports = {
  "run" : function(task, notifyProgress) {
    let arg = task.input;
    return updateTomcatBatch(arg.item,arg.tomcatId);
  }
};
