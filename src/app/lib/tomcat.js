"use strict";

const NodeSSH = require('node-ssh');
var request = require('request-promise-native');


function isAlive(url) {
	return request({
		"url"     : url,
		timeout : 5000
	})
	.then( result => {
		return true;
    })
    .catch( (error) => {
        debugger;
        if( error.response) {
            return true;
        } else {
            return false;
        }
    });
};

module.exports = {
    "isAlive" : isAlive
  };