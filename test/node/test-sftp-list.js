"use strict";

var sftp = require('../../src/node/sftp'),
		fs 			= require('fs'),
		assert  = require('chai').assert;

var config = {};

describe('list remote folder content',function(done){
	this.timeout(5000);

	before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf-8" ));
  });

	it('list remote folders',function(done){
		var folderPath1 = config.homeDir + "/test/data/fs1";
		var folderPath2 = config.homeDir + "/test/data/fs2";

		return sftp.list(config.ssh_source, folderPath1)
		.then(function(result){
			console.log(result);
			return sftp.list(config.ssh_source, folderPath1);
		})
		.then(function(result){
			console.log(result);
			done();
		})
		.done(null, function(err){
			done(err);
		});
	});

	it('fails to list unknown remote folder',function(done){
		var folderPath1 = config.homeDir + "/UNKNOWN";

		return sftp.list(config.ssh_source, folderPath1)
		.then(function(result){
			console.log(result);
		})
		.fail(function(error){
			console.log(error);
			done();
		})
		.done(null, function(err){
			done(err);
		});
	});

});
