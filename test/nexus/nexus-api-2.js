"use strict";

var nexusAPI = require('../../src/nexus/node/nexus-api'),
		fs 			= require('fs'),
		assert  = require('chai').assert;
const path = require('path');

var config = {};

describe('nexus API (2)',function(done){
	this.timeout(5000);

	it('successfully retrive war file',function(done){

    return nexusAPI.getWarfileDescriptor("http://localhost:3000/warfiledesc")
    .then(function(result){
			console.log(JSON.stringify(result));
			assert.equal(result[0].resourceURI, "http://localhost:3000/download/file.war");
			assert.equal(result[0].text, "file.war");
    })
    .done(function(){
      done();
    });
	});

	it('fails to  retrive war file',function(done){

    return nexusAPI.getWarfileDescriptor("http://localhost:3000/m1Release")
    .then(function(result){
			console.log(result);
			assert.isArray(result);
			assert.equal(result.length,0);
    })
    .done(function(){
      done();
    });
	});
});
