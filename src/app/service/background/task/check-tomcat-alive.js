"use strict";

var request = require('request-promise-native');

function run(task, notifyProgress) {
	return request({
		"url"   : task.input,
		timeout : 5000
	})
	.then( result => {
		return true;
    })
    .catch( (error) => {
        if( error.response) {
            return Promise.resolve(true);
        } else {
            return Promise.reject(error);
        }
    });
};

module.exports = {
    "run" : run
  };