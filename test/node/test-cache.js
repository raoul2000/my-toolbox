"use strict";

var cache = require('../../src/node/cache'),
		fs 			= require('fs'),
		assert  = require('chai').assert;
const path = require('path');

var config = {};

describe('cache module',function(done){
	this.timeout(5000);

	before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf-8" ));
  });

	it('creates a temporary file',function(done){

		cache.createTmpLocalFile({
			"host" : "localhost",
			"username" : "user"
		},"/some/folder/file.txt", path.join(__dirname, '..','data','cache'));
		done();
	});
});
