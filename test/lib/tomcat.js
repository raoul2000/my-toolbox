"use strict";

const fs = require('fs'),
  tomcat = require('../../src/app/lib/tomcat'),
  assert = require('chai').assert;

var config = {};

describe('tomcat is alive', function(done) {
  this.timeout(50000);

  it('checks a tomcat is alive', function(done) {
    tomcat.isAlive('http://128.1.229.20:5722')
    .then( result => {
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });

});
