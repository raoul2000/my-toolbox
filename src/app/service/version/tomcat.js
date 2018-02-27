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
