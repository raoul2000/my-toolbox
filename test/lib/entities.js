"use strict";

const fs = require('fs'),
  entities = require('../../src/app/lib/entities'),
  assert = require('chai').assert;
const path = require('path');

var config = {};

describe('entities loader', function(done) {
  this.timeout(50000);

  it('load entities from server', function(done) {

    entities.loadFromServer({
        "host"     : "192.168.203.182",
        "username" : "meth01",
        "password" : "meth01"
    })
    .then( result => {
        assert.isObject(result);
        console.log(result);
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });

 

});