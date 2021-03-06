'user strict';

const lib         = require('../../lib/lib');
const promiseUtil = require('../../lib/promise-utils');
const NodeSSH     = require('node-ssh');
const taskService = require('../task');
const common      = require('./common');

exports.chooseBestResultValue = common.chooseBestResultValue;

exports.finalize = function(webapp) {
  taskService.deleteTask(exports.buildTaskId(webapp));
};

exports.buildTaskId = function(webapp) {
  return `webapp-version-${webapp._id}`;
};

function buildURL(itemData, tomcat, webapp) {
  return `http://${itemData.ssh.host}:${tomcat.port}${webapp.contextPath}`;
}
exports.updateWebapps = function(itemData, webappIds) {
  let optionList = [];
  itemData.tomcats.forEach(tomcat => {
    let webappToUpdate = tomcat.webapps.find( webapp => webappIds.includes(webapp._id));
    if( webappToUpdate ) {
      optionList.push({
        "itemData" : itemData,
        "tomcat"   : tomcat,
        "webappId" : webappToUpdate._id
      });
    }
  });

  // start to work
  return promiseUtil.parallel(optionList, function(options) {
    return exports.updateWebapp(options.itemData, options.tomcat, options.webappId);
  }).
  then( results => {
    return results;
  });
};

/**
 * Entry point to update version of a tomcat instance.
 *
 * @param  {object} itemData a desktop item data instance
 * @param  {string} tomcatId the id of the tomcat to update
 * @param  {object} nodessh  an optional nodessh instance
 * @return {Promise}
 */
exports.updateWebapp = function(itemData, tomcat, webappId) {
    // find the webapp object intance
    let webapp;
    itemData.tomcats.find( tomcat => {
      webapp = tomcat.webapps.find(webapp => webapp._id === webappId);
      return webapp !== undefined;
    });
    if( ! webapp ) {
      return Promise.reject(`webapp not found : id = ${webappId}`);
    }
    // create the update version task id
    let taskId = exports.buildTaskId(webapp);

    // create or read a task
    let task = taskService.acquireTask(taskId);
    if( task === false) {
      return Promise.reject("failed to acquire task : such task may already exist and is still in progress");
    }

    // stop if task already exists
    taskService.startTask(taskId);

    // start the version extraction
    return lib.version.webapp.getVersion({
      "url" : buildURL(itemData,tomcat,webapp)
    })
    .then( results => {
      taskService.stopTask(taskId, true, results);
      return {
        "_id"     : webappId,
        "taskId"  : taskId,
        "values"  : results
      };
    })
    .catch(err => {
      console.error(err);
      taskService.stopTask(taskId, false, err);
      throw err;
    });
};
