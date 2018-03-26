'user strict';

const lib         = require('../../lib/lib');
const promiseUtil = require('../../lib/promise-utils');
const NodeSSH     = require('node-ssh');
const taskService = require('../task');


exports.finalize = function(webappId) {
  taskService.deleteTask(exports.buildTaskId(webappId));
};

exports.buildTaskId = function(webappId) {
  return `webapp-version-${webappId}`;
};

exports.updateWebapp = function(itemData, webappIds) {
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
    let webapp = itemData.tomcat.webapps.find( webapp => webapp._id === webappId);
    if( ! webapp ) {
      return Promise.reject(`webapp not found : id = ${webappId}`);
    }
    // create the update version task id
    let taskId = exports.buildTaskId(webappId);

    // create or read a task
    let task = taskService.acquireTask(taskId);
    if( task === false) {
      return Promise.reject("failed to acquire task : such task may already exist and is still in progress");
    }

    // stop if task already exists
    taskService.startTask(taskId);

    // start the version extraction
    return lib.version.webapp.getVersion({
      "url" : "url to set"
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
