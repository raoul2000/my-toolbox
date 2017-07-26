"use strict";

var fs = require('fs'),
  node_ssh = require('node-ssh'),
  path = require('path'),
  deploySSH = require('../../src/nexus/node/deploy-ssh'),
  assert = require('chai').assert;

var config = {};

describe('deploy SSH', function(done) {
  this.timeout(5000);

  before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/config-stage.json", "utf-8"));
  });

  it('perform the ssh deployment sequence', function(done) {

    var srcFilepath = path.join(__dirname, "/../data/nexus/dummy.war");
    let destFilepath = path.posix.join(config.destBaseDir, "/servlets/dummy.war");
    let symlinkPath = path.posix.join(config.destBaseDir, "/servlets/type1");

    deploySSH.deployType1({
        ssh:config.sshConnect,
        'srcFilepath': srcFilepath,
        'destFilepath': destFilepath,
        'symlinkPath': symlinkPath
      })
      .then(() => {
        done();
      })
      .catch(err => {
        console.error(JSON.stringify(err));
        done();
      });
  });

});
