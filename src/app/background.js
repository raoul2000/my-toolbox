"use strict";

const { ipcRenderer } = require('electron');
var asyncMod          = require("async");
var Queue             = require('better-queue');

/**
 * Helper function to get a random int
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function longDummyProcessing(progress) {
	for (var i = 0; i < 10000; i++) {
		for (var j = 0; j < 100000; j++) {
			var t = j +i;
		}
	}
}

function longAsyncWork(options) {
	let task       = options.task;
	let progressFn = options.progress;

	progressFn(20);
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			progressFn(60);
			longDummyProcessing(progressFn);
			progressFn(90);
			resolve(`task done : ${task.id} - type = ${task.type}`);
		}, getRandomInt(0,1000))
	});
}

function makeProgressFn(task) {
	return function progress(progress) {
		ipcRenderer.send('update-task', {
			"id"       : task.id,
			"progress" : progress
		});
	}
}

let qForDummyTasks = asyncMod.queue(function(task, callback) {
		ipcRenderer.send('update-task', {
			"id"     : task.id,
			"status" : "BUSY"
		});

    longAsyncWork({
			"task"     : task,
			"progress" : makeProgressFn(task)
		})
		.then( result => {
			ipcRenderer.send('update-task', Object.assign(task, {
				"status"   : "SUCCESS",
				"progress" : 100,
				"result"   : result,
				"error"    : null
			}));
			asyncMod.setImmediate( () => callback(null, result) );
		})
		.catch(error => {
			ipcRenderer.send('update-task', Object.assign(task, {
				"status"   : "ERROR",
				"progress" : 100,
				"result"   : null,
				"error"    : error
			}));
			asyncMod.setImmediate( () => callback(error) )
		});
},4);


window.onload = function () {

	ipcRenderer.on('submit-task', (event,task) => {
    console.log("submit-task",task);
		// TODO : use a better queue with progress indicator
		qForDummyTasks.push(
			Object.assign(task,{
				"status"   : "BUSY",
				"progress" : 0,
				"result"   : null,
				"error"    : null
			})
		);
/*
		longAsyncWork(task)
		.then( result => {
			task.result = result;
			console.log("update-task",task);
			ipcRenderer.send('update-task', task);
		});
*/
	});



	ipcRenderer.on('background-start', (event,payload) => {

    console.log("background-start",payload);

		ipcRenderer.send('background-response', {
			result: "result",
      originalPayload : payload
		});
	});
};
