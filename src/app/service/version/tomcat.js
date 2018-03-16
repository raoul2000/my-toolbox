'user strict';

const store = require('../store/store');
const lib = require('../../lib/lib');
const promiseUtil = require('../../lib/promise-utils');
const NodeSSH = require('node-ssh');
const taskService = require('../task');


/**
 * Call this function to clean after the update version task is done
 * @param  {object} tomcat the tomcat instance
 */
exports.finalize = function(tomcat) {
  taskService.deleteTask(exports.createTomcatVersionTaskId(tomcat));
};

/**
 * Choose the best result among a list of results.
 * The winner is the value that has more occurencies in the passed array. Note that
 * unresolved results are ignored.
 *
 * results = [
 *  {
 *    "error" : Error | null,
 *    "resolved" : boolean,
 *    "value" : string
 *   },
 *   etc ...
 * ]
 * @param  {[promiseUtilResult]} results [description]
 * @return {[type]}         [description]
 */
exports.chooseBestResultValue = function( results ) {
  let resultValues = results
    .filter(result => result.resolved)
    .map( result   => result.value);
  return lib.helper.maxOccurenceCountValue(resultValues);
};

/**
 * create a unique task id for a given tomcat and for an version update task
 * @param  {object} tomcat The tomcat object to update version to
 * @return {string}        the unique task id
 */
exports.createTomcatVersionTaskId = function(tomcat) {
  return `tc-version-${tomcat._id}`;
};

exports.upddateTomcats = function(itemData, tomcatIds, nodessh) {

  // try to create a SSH connection wrapper if not obtained from arguments
  let usePrivateSSH = false;
  if( ! nodessh ) {
      nodessh = new NodeSSH(itemData.ssh);
      usePrivateSSH = true;
  }

  // prepare arguments for each tomcat version extraction
  let optionList = tomcatIds.map( id => ({
      "itemData" : itemData,
      "tomcatId" : id,
      "nodessh"  : nodessh
  }));

  // start to work
  return promiseUtil.parallel(optionList, function(options) {
    return exports.updateTomcat(options.itemData, options.tomcatId, options.nodessh);
  }).
  then( results => {
    if( nodessh && usePrivateSSH) {
      nodessh.dispose();
    }
    return results;
  })
  .catch(err => {
    if( nodessh && usePrivateSSH) {
      nodessh.dispose();
    }
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
exports.updateTomcat = function(itemData, tomcatId, nodessh) {
    // find the tomcat object intance
    let tomcat = itemData.tomcats.find( tomcat => tomcat._id === tomcatId);
    if( ! tomcat ) {
      return Promise.reject(`tomcat not found : id = ${tomcatId}`);
    }
    // create the update version task id
    let taskId = exports.createTomcatVersionTaskId(tomcat);

    // create or read a task
    let task = taskService.acquireTask(taskId);
    if( task === false) {
      return Promise.reject("failed to acquire task : such task may already exist and is still in progress");
    }

    // stop if task already exists
    taskService.startTask(taskId);

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
      taskService.stopTask(taskId, true, results);
      return {
        "_id"     : tomcatId,
        "taskId"  : taskId,
        "values"  : results
      };
    })
    .catch(err => {
      console.error(err);
      if( nodessh && usePrivateSSH) {
        nodessh.dispose();
      }
      taskService.stopTask(taskId, false, err);
    });
};
