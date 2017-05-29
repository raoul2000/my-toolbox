"use strict";

var nexusAPI = require('../../src/nexus/node/nexus-api'),
		fs 			= require('fs'),
		assert  = require('chai').assert;
const path = require('path');

var config = {};

describe('nexus API (1)',function(done){
	this.timeout(5000);

	before(function() {
    //config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf-8" ));
  });

	it('successfully retrive module version info',function(done){

    return nexusAPI.fetchModuleVersion({
      "id" : "m1",
      "url" : {
        "release" : "http://localhost:3000/m1Release",
        "snapshot" : "http://localhost:3000/m1Snapshot"
      }
    })
    .then(function(result){
      assert.equal(result.moduleId, "m1");
      assert.isArray(result.release.data);
      assert.isArray(result.snapshot.data);
      console.log(JSON.stringify(result));
    })
    .done(function(){
      done();
    });
	});


	it('fails to retrieve module version info',function(done){

    return nexusAPI.fetchModuleVersion({
      "id" : "m1",
      "url" : {
        "release" : "http://localhost:3000/m1FAILED",
        "snapshot" : "http://localhost:3000/m1FAILED"
      }
    })
    .then(function(result){
      assert.equal(result.moduleId, "m1");
      assert.isUndefined(result.release);
      assert.isUndefined(result.snapshot);
    })
    .done(function(){
      done();
    });
	});
});
