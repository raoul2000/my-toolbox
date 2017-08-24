"use strict";

var getEntities = require('./entities').getEntities;
var extractTomcatIds = require('./tc-identifier').extractTomcatIds;
var extractInstallDir = require('./tc-install-dir').extractInstallDir;
var waterfall = require("promise-waterfall");
var extractTomcatProperties = require('./tc-scan/properties').extractTomcatProperties;
var tcConfig = require('./tc-scan/config');
var descriptor = require('./tc-scan/descriptor');
const NodeSSH = require('node-ssh');

/**
 * Returns :
 * {
 *  entities : {
 *    ENT1_NAME : ENT1_VALUE,
 *    ENT2_NAME : ENT2_VALUE,
 *    ...
 *  },
 *  tomcat : [
 *    {
 *      id : "TCID1",
 *      installDir : "...." ,
 *      prop : [
 *        {  name : "Server version", value : "1"},
 *        {  name : "Server version", value : "1"},
 *         ...
 *      ]
 *    },
 *    { id : "TCID2", installDir : "...."},
 *    ...
 *  ]
 * }
 * @param  {[type]} sshOptions [description]
 * @return {[type]}            [description]
 */
function scan(sshOptions) {
  var scanResult = {
    "entities" : null,
    "tomcat" : []
  };

  let ssh = new NodeSSH();

  return ssh.connect(sshOptions)
  .then( () => getEntities(ssh) )
  .then( entities => {

    ///////////////////////////////////////////////////////////////////////////
    // get tomcat ids and install Dirs

    console.log(entities);
    scanResult.entities = entities;
    return waterfall(
      extractTomcatIds(entities)
      .filter(function(item){
        // only keep a reduced set of tomcat ids for tests purposes
        return item === "inout" || item === "core" || item === "swing"  ;
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
  .then(  result => {
    ///////////////////////////////////////////////////////////////////////////
    // Get Tomcat properties

    console.log(result);
    return waterfall(scanResult.tomcat.map( tc => {
      return function() {
        return extractTomcatProperties(ssh, tc.installDir)
        .then( props => tc.prop = props);
      };
    }));
  })
  .then( result => {

    ///////////////////////////////////////////////////////////////////////////
    // Get Tomcat Conf

    return waterfall(scanResult.tomcat.map( tc => {
      return function() {
        return  tcConfig.getConfig(ssh, tc.installDir, scanResult.entities)
        .then( conf => {
          console.log("AA", conf);
          tc.conf = conf;
          var promises = [];
          conf.contextList.map(confItem => {
            confItem.context.map( context => {
              promises.push(function(){
                var descriptorPath = `${context.docBase}/WEB-INF/web.xml`;
                console.log(descriptorPath);

                return descriptor.getAllServlet(ssh, descriptorPath, scanResult.entities)
                .then(result => {
                  context.servlet = result;
                });
            });
          });
        });
        if( promises.length > 0) {
          return waterfall(promises);
        } else {
          return Promise.resolve(true);
        }
        });
      };
    }));
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
