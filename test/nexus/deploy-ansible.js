"use strict";

var ansible = require('../../src/nexus/node/deploy-ansible'),
		fs 			= require('fs'),
		assert  = require('chai').assert;
const path = require('path');

var config = {};

describe('copy file',function(done){

	it('successfully copy file',function(done){
		ansible.copyFile(
			path.join(__dirname, '..', 'data', 'file1.txt'),
			path.join(__dirname, '..', 'data', 'dest', 'file2.txt')
		);
		done();

	});
});
