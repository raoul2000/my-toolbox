'user strict';

const store = require('./store/store');

exports.addTask = function(taskId, step) {
  store.commit('tmptask/addTask',{
    "id"           : taskId,
    "step"         : step || "UPDATE",
    "status"       : "IDLE",
    "result"       : null,
    "errorMessage" : ""
  });
};

exports.getTask = function(taskId){
    return store.getters['tmptask/taskById'](taskId);
};

exports.startTask = function(taskId){
  store.commit('tmptask/updateTask',{
    "id"           : taskId,
    "updateWith"   : {
      "status"       : "BUSY",
      "result"       : null,
      "errorMessage" : ""
    }
  });
};

exports.stopTask = function(taskId, success, valueOrError) {
  store.commit('tmptask/updateTask',{
    "id"           : taskId,
    "updateWith"   : {
      "status"       : success ? "SUCCESS"    : "ERROR",
      "result"       : success ? valueOrError : null,
      "errorMessage" : success ? null         : valueOrError,
    }
  });
};

/**
 * Returns an update version task with a given Id.
 * If the task doesn't exist it is created
 * @param  {string} taskId the task id
 * @return {object}        the task object
 */
exports.acquireTask = function(taskId) {
  let task = exports.getTask(taskId);
  if( task !== undefined) {
    if( task.status === 'BUSY') {
      return false;
    } else {
      return task;
    }
  } else {
    exports.addTask(taskId);
    return exports.getTask(taskId);
  }
};

/**
 * Delete the update version task for this tomcat.
 * If the task doesn't exist this function as no effect
 * @param  {object} tomcat the tomcat object
 * @return {boolean}        TRUE if the taks could be deleted, FALSE otherwise
 */
exports.deleteTask = function(taskId) {
  let taskDeleted = false;

  // get the task
  let task = exports.getTask(taskId);
  if(task !== undefined ) {
    store.commit('tmptask/deleteTask',task);
    taskDeleted = true;
  } else {
    console.warn(`deleteTask failed : no task found with id ${taskId}`);
  }
  return taskDeleted;
};
