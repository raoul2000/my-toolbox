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
exports.deleteTask = function(taskId) {
  let taskDeleted = false;
  
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
