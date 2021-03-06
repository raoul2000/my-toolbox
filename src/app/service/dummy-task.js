"use strict";

const uuidv1      = require('uuid/v1');
const store       = require('./store/store');
const ipcRenderer = require('electron').ipcRenderer ;

/**
 * Create and returns a single task object instance
 * @return {object} the task
 */
function createTask(id , type, input) {
    return {
      // public properties
      "type"         : type,
      "input"        : input,
      "id"           : id || uuidv1(),

      // internal properties
      "status"       : "IDLE",
      "progress"     : 0,
      "result"       : null,
      "error"        : null
    };
}
// TODO : add task validation (validate ID)

/**
 * Add a task object instance to the main store
 * @param       {object} task the task instance to add to the store
 * @return {string}
 */
function addTaskToStore(task) {
  if( ! task.hasOwnProperty('id')) {
    throw new Error("fail to add task to the store : missing task id");
  }
  // TODO : we should check task.id uniqueness before adding to store
  store.commit('tmptask/addTask',task);
  return task.id;
}

function deleteTaskFromStore(task) {
  let taskId = typeof task === "string" ? task : task.id;
  store.commit('tmptask/deleteTaskById',taskId);
}

function updateTaskInStore(task) {
  store.commit('tmptask/updateTask',{
    "id"           : task.id,
    "updateWith"   : task
  });
}

/**
 * Submit a task for backgropund execution
 * The task STATUS is set to BUSY even if the task will not be executed immediately
 * @param  {object} task the task to execute in background
 */
function submitToQueue(task) {
  updateTaskInStore({
    "id"     : task.id,
    "status" : "BUSY"
  });
  ipcRenderer.send("submit-task", task);
}

////////////////////////////////////////////////////////////////////////////////
// map containing resolve and reject methods to fullfill or reject
// promises related to unfinished tasks

let taskPromiseMap = new Map();

function rejectTaskPromise(key, error) {
  if( taskPromiseMap.has(key)) {
    let taskPromise = taskPromiseMap.get(key);
    taskPromiseMap.delete(key); // remove from the Map
    taskPromise.reject(error);
  } else {
    console.error("reject : task promise not found for key  "+key);
  }
}

function resolveTaskPromise(key, result) {
  if( taskPromiseMap.has(key)) {
    let taskPromise = taskPromiseMap.get(key);
    taskPromiseMap.delete(key);   // remove from the Map
    taskPromise.resolve(result);
  } else {
    console.error("resolve : task promise not found for key : "+key);
  }
}

function buildKey(task) {
  return `key-${task.type}-${task.id}`;
}
////////////////////////////////////////////////////////////////////////////////

/**
 * Delete or update a task in the store depending on the task property 'persistAfterDone'.
 * By default the task is removed from the store unless persistAfterDone is TRUE
 * @param  {object} task the task to process
 */
function updateOrDeleteTask(task) {
  if( task.persistAfterDone === true) {
    updateTaskInStore(task);
  } else {
    deleteTaskFromStore(task);
  }
}

/**
 * Upon reception of an update event regarding a task :
 * - update the store for this task (update or delete)
 * - resolve or reject the related pending promise
 */
ipcRenderer.on('update-task', (event, task) => {
    console.log("update-task", task);
    let k = buildKey(task);
    if( task.status === "ERROR") {
      updateOrDeleteTask(task);
      rejectTaskPromise(k,task.error);
    }else if(task.status === "SUCCESS") {
      resolveTaskPromise(k,task.result);
      updateOrDeleteTask(task);
    } else {
      updateTaskInStore(task);
    }
});


/**
 * Creates and submit a new task for background execution.
 *
 * options = {
 *  "id"    : "taskId",
 *  "type"  : "the task type",
 *  "input" : any // taks input arguments
 * }
 * If no "id" is provided, it is created when the task is created.
 *
 * The returned object provides the task Id, and a promise of result
 * for this task.
 * @param  {object} options task info
 * @return {object}         new task object info
 */
function submitTask(options) {
  if( ! options.type ) {
    throw new Error('missing task type parameter');
  }
  let task = createTask(options.id, options.type, options.input);
  addTaskToStore(task);
  let p = new Promise( (resolve, reject) => {
    taskPromiseMap.set(buildKey(task), {
      "resolve" : resolve,
      "reject"  : reject
    });
  });
  submitToQueue(task);
  return {
    "id"      : task.id,
    "promise" : p
  };
}

/**
 * Create tasks and submit them for execution
 * @return {array} array of tasks ids submitted
 */
function submitManyTasks(taskType){
  console.log("submiting many tasks");

  let taskIds = [];
  for (var i = 0; i < 3; i++) { // work on 10 dummy tasks
    let task = createTask(taskType);
    addTaskToStore(task);
    submitToQueue(task);
    taskIds.push(task.id);
  }
  return taskIds;
}

module.exports = {
  "submitManyTasks"     : submitManyTasks,
  "submitTask"          : submitTask,
  "createTask"          : createTask,
  "addTaskToStore"      : addTaskToStore,
  "updateTaskInStore"   : updateTaskInStore,
  "deleteTaskFromStore" : deleteTaskFromStore
};
