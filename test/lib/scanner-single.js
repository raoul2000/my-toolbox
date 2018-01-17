"use strict";

const fs = require('fs'),
  scanner = require('../../src/app/lib/tomcat-scanner/scan-single'),
  assert = require('chai').assert;

var config = {};

describe('tomcat scanner', function(done) {
  this.timeout(50000);

  before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/../config-stage.json", "utf-8"));
  });

  it('scan tomcats', function(done) {

    scanner.run({
      ssh : config.ssh,
      //tomcats : [ { id : "ID1"}, { id : "CORE"}, { id : "ID2"}]
      tomcats : [  { id : "CORE"}]
    })
    .then( result => {
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });

});
