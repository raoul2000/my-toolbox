"use strict";

const fs = require('fs'),
  runExternal = require('../../src/app/lib/run-external'),
  assert = require('chai').assert;
const path = require('path');

var config = {};

describe('Run External', function(done) {
  this.timeout(50000);

  it('runs a dir command', function(done) {

    runExternal.run("dir")
    .then( result => {
        assert.isObject(result);
        assert.property(result,"stdout");
        assert.property(result,"stderr");
        console.log(result.stdout);
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });

  it('runs a dir command with interpolation', function(done) {

    runExternal.run("dir {{FOLDER}}", { 'FOLDER' : __dirname})
    .then( result => {
        assert.isObject(result);
        assert.property(result,"stdout");
        assert.property(result,"stderr");
        console.log(result.stdout);
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });

  it('runs a dir command with interpolation (2)', function(done) {

    runExternal.run("\"C:\\Program Files\\PuTTY\\putty.exe\" {{IP}}", { 'IP' : "192.168.203.182"})
    .then( result => {
        assert.isObject(result);
        assert.property(result,"stdout");
        assert.property(result,"stderr");
        console.log(result.stdout);
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });

});