"use strict";

var compare = require('../../src/node/md5-compare'),
		fs 			= require('fs'),
		assert  = require('chai').assert;

var config = {};

describe('Compare two remote folders',function(done){
	this.timeout(5000);

	before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf-8" ));
  });

	it('list one remote folder',function(done){
		var folderPath = config.homeDir + '/test/data/fs1';
		return compare.md5Folder(config.ssh_source,folderPath)
		.then(function(result){
			console.log(result);
			done();
		})
		.done(null, function(err){
			done(err);
		});
	});


	it('list two remote folders and compare',function(done){

		var srcFolderPath = config.homeDir + '/test/data/fs1';
		var trgFolderPath = config.homeDir + '/test/data/fs2';

		var trgResult = {};
		var srcResult = {};

		return compare.md5Folder(config.ssh_source,srcFolderPath)
		.then(function(result){
			srcResult = result;
			console.log(srcResult);
			return compare.md5Folder(config.ssh_source, trgFolderPath);
		})
		.then(function(result){
			trgResult = result;
			console.log(trgResult);
			let finalResult  = compare.diff(srcResult, trgResult);
			console.log(finalResult);
			done();
		})
		.done(null, function(err){
			done(err);
		});
	});

});
