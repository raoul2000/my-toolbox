"use strict";

const fs = require('fs'),
  interpolate = require('../../src/app/lib/run-external').interpolate,
  assert = require('chai').assert;

var config = {};

describe('Interpolate', function(done) {
  

  it('replace a variable by its value', function(done) {
    let result = interpolate("this is {{ONE}} variable", {
        "ONE" : 1
    });
    assert.equal(result,"this is 1 variable");
    done();
  });

  it('replace all occurence of a  variable by its value', function(done) {
    let result = interpolate("this is {{ONE}} variable and another {{ONE}} here too", {
        "ONE" : 1
    });
    assert.equal(result,"this is 1 variable and another 1 here too");
    done();
  });

  it('replace all occurence of all variables', function(done) {
    let result = interpolate("one {{ONE}} two {{TWO}} three {{THREE}}", {
        "ONE" : 1,
        "TWO" : 2,
        "THREE" : 3
    });
    assert.equal(result,"one 1 two 2 three 3");
    done();
  });

  it('consider variable name as case sensitive', function(done) {
    let result = interpolate("1 = {{ONE}} 1 = {{one}}", {
        "one" : "lowercase 1",
        "ONE" : "uppercase 1",
    });
    assert.equal(result,"1 = uppercase 1 1 = lowercase 1");
    done();
  });

});