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
    config = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8"));
  });

  it('perform the ssh deployment sequence', function(done) {
    var srcFilepath = path.join(__dirname, "/../data/nexus/dummy.war");
    let destFilepath = "/root/target-1.3/dummy.war";
    let symlinkPath = "/root/target";
    deploySSH.deployStandard({
        ssh: {
          'host': '127.0.0.1',
          'port': 2222,
          'username': 'root',
          'password': 'root'
        },
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
