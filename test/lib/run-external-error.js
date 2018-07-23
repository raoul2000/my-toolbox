"use strict";

const fs = require('fs'),
  runExternal = require('../../src/app/lib/run-external'),
  assert = require('chai').assert;
const path = require('path');

var config = {};

describe('Run External', function(done) {
  this.timeout(50000);


  it('fails in case of error', function(done) {

    runExternal.run("C:\\Program Files\\PuTTY\\putty.exe {{IP}}", { 'IP' : "192.168.203.182"})
    .then( result => {
        assert.isObject(result);
        assert.property(result,"stdout");
        assert.property(result,"stderr");
        console.log("stdout = ",result.stdout);
        console.log("stderr = ", result.stderr);
      done();
    })
    .catch(err => {
        console.log("ERROR !!!");
      console.log(err);
      done(err);
    });
  });

});