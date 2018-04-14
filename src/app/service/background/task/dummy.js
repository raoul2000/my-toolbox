"use strict";

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


function run(task, notifyProgress) {

	notifyProgress(20);
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			notifyProgress(60);
			longDummyProcessing();
			notifyProgress(90);
      let result = getRandomInt(0,1000);
			resolve(`task done : result = ${result} - id = ${task.id} - type = ${task.type}`);
		}, getRandomInt(0,1000))
	});
}

module.exports = {
  "run" : run
};
