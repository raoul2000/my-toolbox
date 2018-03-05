'user strict';

const store = require('../store/store');
const lib = require('../../lib/lib');
const promiseUtil = require('../../lib/promise-utils');
const NodeSSH = require('node-ssh');

function addTask(taskId) {
  store.commit('tmptask/addTask',{
    "id"           : taskId,
    "step"         : "UPDATE",
    "status"       : "IDLE",
    "result"       : null,
    "errorMessage" : ""
  });
}

function getTask(taskId){
    return store.getters['tmptask/taskById'](taskId);
}

function startTask(taskId) {
  store.commit('tmptask/updateTask',{
    "id"           : taskId,
    "updateWith"   : {
      "status"       : "BUSY",
      "result"       : null,
      "errorMessage" : ""
    }
  });
}

function stopTask(taskId, success, valueOrError) {
  store.commit('tmptask/updateTask',{
    "id"           : taskId,
    "updateWith"   : {
      "status"       : success ? "SUCCESS"    : "ERROR",
      "result"       : success ? valueOrError : null,
      "errorMessage" : success ? null         : valueOrError,
    }
  });
}
/**
 * Returns an update version task with a given Id.
 * If the task doesn't exist it is created
 * @param  {string} taskId the task id
 * @return {object}        the task object
 */
function acquireTask(taskId) {
  let task = getTask(taskId);

  if( task !== undefined) {
    if( task.status === 'BUSY') {
      return false;
    } else {
      return task;
    }
  } else {
    addTask(taskId);
    return getTask(taskId);
  }
}
/**
 * Delete the update version task for this tomcat.
 * If the task doesn't exist this function as no effect
 * @param  {object} tomcat the tomcat object
 * @return {boolean}        TRUE if the taks could be deleted, FALSE otherwise
 */
exports.deleteTask = function(tomcat) {
  let taskDeleted = false;
  // create the update version task id
  let taskId = exports.createTomcatVersionTaskId(tomcat);
  // get the task
  let task = getTask(taskId);
  if(task !== undefined ) {
    store.commit('tmptask/deleteTask',task);
    taskDeleted = true;
  } else {
    console.warn(`deleteTask failed : no task found with id ${taskId}`);
  }
  return taskDeleted;
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
    let task = acquireTask(taskId);
    if( task === false) {
      return Promise.reject("failed to acquire task : such task may already exist and is still in progress");
    }

    // stop if task already exists
    startTask(taskId);

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
      stopTask(taskId, true, results);
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
      stopTask(taskId, false, err);
    });
};
