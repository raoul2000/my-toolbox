"use strict";

var artefact = require('../../src/nexus/node/artefact'),
		fs 			= require('fs'),
		assert  = require('chai').assert;
const path = require('path');

var config = {};

describe('artefact (1)',function(done){
	this.timeout(5000);

	before(function() {
    //config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf-8" ));
  });

	it('successfully build aretefact list from local folder',function(done){

    return artefact.buildListFromLocalFolder(__dirname + '/../data/nexus/artefact')
    .then(function(result){
			console.log(result);
			/*
      assert.equal(result.moduleId, "m1");
      assert.isArray(result.release.data);
      assert.isArray(result.snapshot.data);
      console.log(JSON.stringify(result));
			*/
    })
    .done(function(){
      done();
    });
	});
});
