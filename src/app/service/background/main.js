"use strict";

const { ipcRenderer } = require('electron');
var asyncMod          = require("async");
var Queue             = require('better-queue');

function makeProgressFn(task) {
	return function progress(progress) {
		ipcRenderer.send('update-task', {
			"id"       : task.id,
			"progress" : progress
		});
	}
}

let taskRunnerMap = new Map();
function getTaskRunnerQueue(taskType) {
  let queue = null;
  if( taskRunnerMap.has(taskType)) {
    queue = taskRunnerMap.get(taskType);
  } else {
    console.info(`no queue found for task type [${taskType}] : creating one` );
    let taskModule = require(`./task/${taskType}`);
    queue = asyncMod.queue(function(task, callback) {
        taskModule.run(task, makeProgressFn(task))
    		.then( result => {
					console.log(`%c <- SUCCESS : ${task.id}`,"background:#81ff59");
    			ipcRenderer.send('update-task', Object.assign(task, {
    				"status"   : "SUCCESS",
    				"progress" : 100,
    				"result"   : result,
    				"error"    : null
    			}));
    			asyncMod.setImmediate( () => callback(null, result) );
    		})
    		.catch(error => {
					console.error(error);
					console.log(`%c <- ERROR : ${task.id}`,"background:#f52a2a; color:white");
    			ipcRenderer.send('update-task', Object.assign(task, {
    				"status"   : "ERROR",
    				"progress" : 100,
    				"result"   : null,
    				"error"    : error
    			}));
    			asyncMod.setImmediate( () => callback(error) )
    		});
    },4);
    taskRunnerMap.set(taskType,queue);
    console.info(` ${taskRunnerMap.size} task queue(s) available`);
  }
  return queue;
}

window.onload = function () {
  /**
   * task submition handler.
   * The task object must have the following structure :
   *
   * task = {
   *  "type" : "taskType"
   * }
   * All other properties are optional
   */
	ipcRenderer.on('submit-task', (event,task) => {
		console.log(`%c -> SUBMIT : ${task.id}`,"background:#72cffd");
    console.debug("task : ",task);
    try {
      getTaskRunnerQueue(task.type)
      .push(
        Object.assign(task,{
          "status"   : "BUSY",
          "progress" : 0,
          "result"   : null,
          "error"    : null
        })
      );
    } catch (error) {
      console.error("failed to submit new task",error);
			console.log(`%c <- ERROR : ${task.id}`,"background:#f52a2a; color:white");
      ipcRenderer.send('update-task', Object.assign(task, {
				"status"   : "ERROR",
				"progress" : 0,
				"result"   : null,
				"error"    : error
			}));
    }
	});
};
