'user strict';

const lib         = require('../../lib/lib');
const NodeSSH     = require('node-ssh');
const taskService = require('../task');

/**
 * Call this function to clean after the update version task is done
 * @param  {object} tomcat the tomcat instance
 */
exports.finalize = function(command) {
  taskService.deleteTask(exports.buildTaskId(command));
};

exports.buildTaskId = function(command) {
  return `cmd-run-${command._id}`;
};

/**
 * Run a bash command on a remote server through an SSH connection.
 *  
 * @param {object} sshConnectionParams SSH connection settings. If password is encrypted, it is 
 * decrypted by this function
 * @param {object} command the command to execute
 * @param {object} nodessh an optional SSH connection object that will be used if provided
 * @returns {Promise} 
 */
exports.runCommand = function(sshConnectionParams, command, nodessh) {

  // create the update version task id
  let taskId = exports.buildTaskId(command);

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

  // start the command execution (decrypt password if needed)
  
  return nodessh.connect(lib.secret.decryptPassword(sshConnectionParams))
  .then( result => {
    return lib.smartCommand.run(nodessh, {
      "command" : command.source
    });
  })
  .then( result => {
    if( nodessh && usePrivateSSH) {
      nodessh.dispose();
    }
    taskService.stopTask(taskId, true, result);
    
    return Object.assign(result, {
      "_id"     : command._id,
      "taskId"  : taskId
    });
  })
  .catch(err => {
    console.error(err);
    if( nodessh && usePrivateSSH) {
      nodessh.dispose();
    }
    taskService.stopTask(taskId, false, err);
  });
};
