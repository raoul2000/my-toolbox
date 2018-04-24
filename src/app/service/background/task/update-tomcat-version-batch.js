"use strict";

const lib     = require('../../../lib/lib');
const NodeSSH = require('node-ssh');
const updateTomcatVersion = require('./update-tomcat-version');
const asyncUtil = require('async');

/**
 * Entry point to update version of a tomcat instance.
 *
 * @param  {object} itemData a desktop item data instance
 * @param  {[string]} tomcatIds the ids of the tomcat to update
 * @param  {object} nodessh  an optional nodessh instance
 * @return {Promise}
 */
 function updateTomcatBatch(itemData, tomcatIds) {
   // try to create a SSH connection wrapper if not obtained from arguments

    let nodessh = new NodeSSH(itemData.ssh);
    debugger;
   let asyncFn = tomcatIds.map( id => {
     return function(cb){
       updateTomcatVersion.updateTomcat(itemData, id, nodessh)
       .then( result => {cb(null,{ "id" : id, "result" : result})})
       .catch(error  => {cb({"id" : id, "error" : error})});
     };
   });
   return new Promise( (resolve,reject)=> {
     asyncUtil.parallel(asyncFn,(err,results) => {
       console.log("asyncUtil.parallel : done");
       nodessh.dispose();
       if( err ) {
         reject(err);
       } else {
         resolve(results);
       }
     });
   });

}


function run(task, notifyProgress) {
  let arg = task.input;
  return updateTomcatBatch(arg.item,arg.tomcatId);
}

module.exports = {
  "run" : run
};
