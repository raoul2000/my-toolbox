"use strict";


var request = require('request-promise-native');

function run(task, notifyProgress) {
	return request({
		url     : task.input,
		headers : {'Accept' : ' application/json'},
		timeout : 5000,
		json    : true
	})
	.then( result => {
		return result.data;
	});
}

module.exports = {
  "run" : run
};
