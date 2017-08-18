"use strict";

var getEntities = require('./entities').getEntities;
var extractTomcatIds = require('./tc-identifier').extractTomcatIds;
var extractInstallDir = require('./tc-install-dir').extractInstallDir;
var waterfall = require("promise-waterfall");
const NodeSSH = require('node-ssh');


function scan(sshOptions) {
  var scanResult = {
    "entities" : null,
    "tomcat" : []
  };
  let ssh = new NodeSSH();
  return ssh.connect(sshOptions)
  .then( () => getEntities(ssh) )
  .then( entities => {
    console.log(entities);
    scanResult.entities = entities;
    return waterfall(
      extractTomcatIds(entities)
      .filter(function(item){
        // only keep a reduced set of tomcat ids for tests purposes
        return item === "inout" || item === "core" ;
        //return true;
      }).map( tcId => {
        return function() {
          return extractInstallDir(ssh, tcId)
          .then( result => {
            scanResult.tomcat.push(result);
          });
        };
      })
    );
  })
  .then( result => {
    ssh.dispose();
    return scanResult;
  })
  .catch(err => {
    console.error(err);
    ssh.dispose();
    throw new Error(err);
  });
}

exports.scan = scan;
