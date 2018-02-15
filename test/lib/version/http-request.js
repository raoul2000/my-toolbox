"use strict";

const fs = require('fs'),
  version = require('../../../src/app/lib/version/http-request'),
  lib = require('../../../src/app/lib/lib'),
  assert = require('chai').assert;

var config = {};

describe('Version extractor', function(done) {
  this.timeout(50000);

  it('performs a Request', function(done) {
    lib.version.type.httpRequest.getVersion(
      {
        "url" : "http://172.24.150.171:3410/imgserv/service/ui/info",
        "versionExtractor" : lib.version.extractor.service_ui_info.extract
      })
    .then( result => {
      console.log(result);
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });

});
