"use strict";

var child_process   = require('child_process'),
		fs 			= require('fs'),
		assert  = require('chai').assert;

var config = {};

describe('exec file sync',function(done){
	it('starts winmerge',function(done){
		child_process.execFileSync("c:\\Program Files (x86)\\WinMerge\\WinMergeU.exe", [
				"c:\\tmp\\srcf1.txt",
				"c:\\tmp\\trgf1.txt"
			]);
	});
});
