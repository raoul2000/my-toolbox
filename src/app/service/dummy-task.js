"use strict";

const uuidv1      = require('uuid/v1');
const store       = require('./store/store');
const ipcRenderer = require('electron').ipcRenderer ;

/**
 * Create and returns a single task object instance
 * @return {object} the task
 */
function createTask() {
    return {
      "id"           : uuidv1(),
      "status"       : "IDLE",
      "progress"     : 0,
      "result"       : null,
      "errorMessage" : ""
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

/**
 * Upon reception of an update event regarding a task, update the persistent
 * state of this task into the store.
 */
ipcRenderer.on('update-task', (event, task) => {
    console.log("update-task", task);
    updateStore(task);
});

/**
 * Create tasks and submit then for execution
 * @return {array} array of tasks ids submitted
 */
function submitManyTasks(){
  console.log("submiting many tasks");

  let taskIds = [];
  for (var i = 0; i < 3; i++) { // work on 10 dummy tasks
    let task = createTask();
    addToStore(task);
    submitToQueue(task);
    taskIds.push(task.id);
  }
  return taskIds;
}


module.exports = {
  "submitManyTasks" : submitManyTasks
};
