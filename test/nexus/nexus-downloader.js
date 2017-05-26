"use strict";

var nexus = require('../../src/nexus/node/nexus-downloader'),
  fs = require('fs'),
  assert = require('chai').assert;
const path = require('path');

var config = {};

describe('cache module', function(done) {
  this.timeout(5000);

  before(function() {
    //config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf-8" ));
  });

  it('successfully download a file with progress', function(done) {

    return nexus.download(
        'https://az412801.vo.msecnd.net/vhd/VMBuild_20141027/VirtualBox/IE11/Windows/IE11.Win8.1.For.Windows.VirtualBox.zip',
        'd:\\tmp\\file.zip'
      )
      .then(function(result) {
        assert.equal(result.moduleId, "m1");
        assert.isArray(result.release.data);
        assert.isArray(result.snapshot.data);
        console.log(JSON.stringify(result));
        done();
      }, function(error) {
        done(error);
      }, function(progress) {
        console.log("progress");
        console.log(progress);
      });
  });


});
