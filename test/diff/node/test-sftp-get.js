"use strict";

var sftp = require('../../../src/node/sftp'),
		fs 			= require('fs'),
		assert  = require('chai').assert;

var config = {};

describe('get remote file',function(done){
	this.timeout(5000);

	before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf-8" ));
  });

	it('get remote file',function(done){
		var filePath1 = config.homeDir + "/test/data/fs1/identical.txt";
		var localFilepath = __dirname + "/../../data/tmp/identical.txt"

		return sftp.get(config.ssh_source, filePath1, localFilepath, true)
		.then(function(result){
			console.log(result);
			done();
		})
		.done(null, function(err){
			done(err);
		});
	});

});
