"use strict";

const NodeSSH = require('node-ssh');
const Entities = require('./entities');
const Descriptor = require('./descriptor');
const TCConfig = require('./tc-config');
const extractInstallDir = require('./tc-install-dir').extractInstallDir;
const PromiseUtil = require('../promise-utils');

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
  // TODO : using xmllint (when available) it could be possible to resolve entities on server side
  //xmllint --loaddtd --noent --dropdtd ./conf/server.xml
    let entities = {};
    let ssh = new NodeSSH();
    return ssh.connect(options.ssh)
    .then( () => Entities.getEntities(ssh) )
    .then( result => {
      //console.log("======= entities", result);
      entities = result;
      let tasks = options.tomcats.map( tomcat => {
        return {
          "ssh"    : ssh, // opened ssh connection
          "tomcat" : tomcat
        };
      });
      return PromiseUtil.serial(tasks, extractInstallDir);
    })
    .then( results => {
      /**
       * results = [
       *    {
       *      value: { id: 'CORE', installDir: '/methode/meth01/tomcat-core' },
       *      error : null,
       *      resolved : true
       *    },
       *    {
       *      value: { id: 'CORE', error : { code :2, message : "error Message"}},
       *      error : null,
       *      resolved : true
       *    } ...
       *
       * ]
       */
      console.log(results);
      let tasks = results
      .filter(result => result.resolved && ! result.value.error)
      .map( result => {
        console.log("====", result.value.installDir);
        return {
          "ssh"              : ssh,
          "tomcatId"         : result.value.id,
          "tomcatInstallDir" : result.value.installDir,
          "xmlEntities"      : entities
        };
      });
      return PromiseUtil.serial(tasks, TCConfig.getConfig);
    })
    .then( results => {
      let tasks = [];
      results
      .filter( result =>  result.resolved && ! result.value.error )
      .forEach( result => {
        result.value.contextList.forEach( confItem => {
          confItem.context.forEach( context => {
            tasks.push({
              "ssh"            : ssh,
              "descriptorPath" : `${context.docBase}/WEB-INF/web.xml`,
              "xmlEntities"    : entities
            });
          });
        });
      });
      return PromiseUtil.serial(tasks, Descriptor.getAllServlet);
    })
    .then( results => {
      // [ { "error" : null, "resolved" : true, "value" : {....}}]
      results
      .filter( result =>  result.resolved && ! result.value.error )
      .forEach( result => {
        result.value.forEach( servlet => {
          /**
           * servlet = {
           *  "class" : "com.my.namespace.Classe",
           *  "name" : "my Name",
           *  "urlPatterns" : [  "/url/*", "/serlet/url/*" ]
           * }
           */
        });
      });
      ssh.dispose();
    })
    .catch( err => {
      ssh.dispose();
      console.error(err);
    });
};
