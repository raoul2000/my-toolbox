"use strict";

const uuidv1      = require('uuid/v1');
const store       = require('./store/store');
const ipcRenderer = require('electron').ipcRenderer ;

/**
 * Create and returns a single task object instance
 * @return {object} the task
 */
function createTask(taskType) {
    return {
      "id"           : uuidv1(),
      "type"         : taskType,
      "status"       : "IDLE",
      "progress"     : 0,
      "input"        : null,
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
function addToStore(task) {
  if( ! task.hasOwnProperty('id')) {
    throw new Error("fail to add task to the store : missing task id");
  }
  // TODO : we should check task.id uniqueness before adding to store
  store.commit('tmptask/addTask',task);
  return task.id;
}

function updateStore(task) {
  store.commit('tmptask/updateTask',{
    "id"           : task.id,
    "updateWith"   : task
  });
}

/**
 * Submit a task for backgropund execution
 * @param  {object} task the task to execute in background
 */
function submitToQueue(task) {
  ipcRenderer.send("submit-task", task);
}

// map containing resolve and reject methods to fullfill or reject
// promises related to unfinished tasks
let taskPromise = {};

/**
 * Upon reception of an update event regarding a task, update the persistent
 * state of this task into the store.
 */
ipcRenderer.on('update-task', (event, task) => {
    console.log("update-task", task);
    updateStore(task);
    if( task.status === "ERROR") {
      taskPromise[task.id].reject(task.error);
      taskPromise[task.id] = null;  // TODO: delete property instead ?
    }else if(task.status === "SUCCESS") {
      taskPromise[task.id].resolve(task.result);
      taskPromise[task.id] = null;  // TODO: delete property instead ?
    }
});


/**
 * options = {
 *  "type"  : "the task type",
 *  "input" : any // taks input arguments
 * }
 * @param  {object} options task info
 * @return {object}         new task object info
 */
function submitTask(options) {
  let task = createTask(options.type);
  addToStore(task);
  let p = new Promise( (resolve, reject) => {
    taskPromise[task.id] = {
      "resolve" : resolve,
      "reject"  : reject
    };
  });
  submitToQueue(task);
  return {
    "id"      : task.id,
    "promise" : p
  };
}

/**
 * Create tasks and submit then for execution
 * @return {array} array of tasks ids submitted
 */
function submitManyTasks(taskType){
  console.log("submiting many tasks");

  let taskIds = [];
  for (var i = 0; i < 3; i++) { // work on 10 dummy tasks
    let task = createTask(taskType);
    addToStore(task);
    submitToQueue(task);
    taskIds.push(task.id);
  }
  return taskIds;
}

function submitManyTasks_promise(taskType){
  console.log("submiting many tasks");

  let p = [];
  let taskInfo;
  let taskIds = [];
  for (var i = 0; i < 3; i++) { // work on 10 dummy tasks
    taskInfo = submitTask({
      "type" : taskType,
      "input" : i
    });
    p.push(taskInfo.promise);
    taskIds.push(taskInfo.id);
  }
  return {
    "id"      : taskIds,
    "promise" : Promise.all(p)
  };
}


module.exports = {
  "submitManyTasks" : submitManyTasks,
  "submitTask"      : submitTask
};
