"use strict";

const { ipcRenderer } = require('electron');
var Queue = require('better-queue');


/**
 * Helper function to get a random int
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function longDummyProcessing() {
	for (var i = 0; i < 10000; i++) {
		for (var j = 0; j < 100000; j++) {
			var t = j +i;
		}
	}
}

function longAsyncWork(task) {
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			longDummyProcessing();
			resolve(`task done : ${task.id}`);
		}, getRandomInt(0,1000))
	});
}

var qForDummyTasks = new Queue( (input, cb) => {
	
});


window.onload = function () {

	ipcRenderer.on('submit-task', (event,task) => {
    console.log("submit-task",task);
		// TODO : use a better queue with progress indicator
		longAsyncWork(task)
		.then( result => {
			task.result = result;
			console.log("update-task",task);
			ipcRenderer.send('update-task', task);
		});

	});



	ipcRenderer.on('background-start', (event,payload) => {

    console.log("background-start",payload);

		ipcRenderer.send('background-response', {
			result: "result",
      originalPayload : payload
		});
	});
};
