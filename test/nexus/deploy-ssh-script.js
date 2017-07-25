"use strict";

var fs = require('fs'),
  node_ssh = require('node-ssh'),
  path = require('path'),
  deploySSH = require('../../src/nexus/node/deploy-ssh'),
  assert = require('chai').assert;

var config = {};

describe('deploy SSH with Script', function(done) {
  this.timeout(5000);

  before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/config-stage.json", "utf-8"));
  });

  it('perform the ssh deployment sequence', function(done) {
    var srcFilepath = path.join(__dirname, "/../data/nexus/dummy.war");
    let destFilepath = path.posix.join(config.destBaseDir, "/test-dep/1/dummy.war");
    let srcScriptpath = path.join(__dirname, "/../data/nexus/deploy-script-1.bash");
    let destScriptpath = path.posix.join(config.destBaseDir, "/test-dep/1/deploy-script-1.bash");

    deploySSH.deployByScript({
        ssh:config.sshConnect,
        'srcFilepath': srcFilepath,
        'destFilepath': destFilepath,
        'script' : {
          'srcFilepath': srcScriptpath,
          'destFilepath': destScriptpath,
          'arg' : [
            "arg1", "another arg", "final arg"
          ]
        }
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
