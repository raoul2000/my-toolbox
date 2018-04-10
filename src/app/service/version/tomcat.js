'user strict';

const lib         = require('../../lib/lib');
const promiseUtil = require('../../lib/promise-utils');
const NodeSSH     = require('node-ssh');
const taskService = require('../task');
const common      = require('./common');
const Queue       = require('better-queue');

const ipcRenderer  = require('electron').ipcRenderer ;

var qTomcatVersion = new Queue(function (input, cb) {

  // Some processing here ...

  cb(null, result);
});

exports.chooseBestResultValue = common.chooseBestResultValue;

/**
 * Call this function to clean after the update version task is done
 * @param  {object} tomcat the tomcat instance
 */
exports.finalize = function(tomcat) {
  taskService.deleteTask(exports.buildTaskId(tomcat));
};


/**
 * create a unique task id for a given tomcat and for an version update task
 * @param  {object} tomcat The tomcat object to update version to
 * @return {string}        the unique task id
 */
exports.buildTaskId = function(tomcat) {
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

/*
  qTomcatVersion.push(1,(error, result) => {

  });*/

  // start to work
  return promiseUtil.parallel(optionList, function(options) {
    return exports.updateTomcat(options.itemData, options.tomcatId, options.nodessh);
  })
  .then( results => {
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

ipcRenderer.on('background-response', (event, payload) => {
		console.log('background-response',payload);
});

function simulateLongProcess(itemData, tomcatId, nodessh) {

  ipcRenderer.send("background-start", itemData);

  // find the tomcat object intance
  let tomcat = itemData.tomcats.find( tomcat => tomcat._id === tomcatId);
  if( ! tomcat ) {
    return Promise.reject(`tomcat not found : id = ${tomcatId}`);
  }
  // create the update version task id
  let taskId = exports.buildTaskId(tomcat);

  // create or read a task
  let task = taskService.acquireTask(taskId);
  if( task === false) {
    return Promise.reject("failed to acquire task : such task may already exist and is still in progress");
  }

  // stop if task already exists
  taskService.startTask(taskId);

  return new Promise ( (resolve, reject) => {
    setTimeout( () => {
      for (var i = 0; i < 10000; i++) {
        for (var j = 0; j < 100000; j++) {
          var t = j +i;
        }
      }
      taskService.stopTask(taskId, true, {});
      resolve({});
    },100);
  });

}

/**
 * Entry point to update version of a tomcat instance.
 *
 * @param  {object} itemData a desktop item data instance
 * @param  {string} tomcatId the id of the tomcat to update
 * @param  {object} nodessh  an optional nodessh instance
 * @return {Promise}
 */
 function updateTomcat(itemData, tomcatId, nodessh) {
    // find the tomcat object intance
    let tomcat = itemData.tomcats.find( tomcat => tomcat._id === tomcatId);
    if( ! tomcat ) {
      return Promise.reject(`tomcat not found : id = ${tomcatId}`);
    }
    // create the update version task id
    let taskId = exports.buildTaskId(tomcat);

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
      throw err;
    });
}

exports.updateTomcat = simulateLongProcess;
