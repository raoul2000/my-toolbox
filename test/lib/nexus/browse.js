"use strict";

const  browse = require('../../../src/app/lib/nexus/browse'),
       assert = require('chai').assert;


describe('nexus API (1)',function(done){
	this.timeout(5000);

	it('successfully retrive module version info',function(done){

    browse.fetchModuleVersion({
      "id" : "m1",
      "url" : {
        "release"  : "http://127.0.0.1:8080/nexus/content/repositories/public/com/raoul2000/webapp/preview",
        "snapshot" : "http://127.0.0.1:8080/nexus/content/repositories/public/com/raoul2000/webapp/preview"
      }
    })
    .then(function(result){
      console.log(JSON.stringify(result));
      done();
    })
    .catch(( err ) => {
      console.error(err);
      done(err);
    });
	});
});
