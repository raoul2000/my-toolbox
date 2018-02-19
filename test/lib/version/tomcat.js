"use strict";

const fs = require('fs'),
  version = require('../../../src/app/lib/version/http-request'),
  lib = require('../../../src/app/lib/lib'),
  NodeSSH = require('node-ssh'),
  path = require('path'),
  assert = require('chai').assert;

var config = {};

describe('Version extractor', function(done) {
  this.timeout(50000);

  before(function() {
    config = JSON.parse(fs.readFileSync( path.join(__dirname,'..','..',"/config-stage.json"), "utf-8"));
  });

  it('extract version using ssh commands', function(done) {
    let ssh = new NodeSSH();
    ssh.connect(config.ssh)
    .then( () => {
      return     lib.version.tomcat.getVersion(
            {
              "nodessh" : ssh,
              "tomcat" : {
                "id" : "inout",
                "ip" : config.ssh.host,
                "port" : 3440
              }
            });
    })
    .then((commandResult) => {
      console.log(commandResult);
      ssh.dispose();
      done();
    })
    .catch(err => {
      console.log(err);
      ssh.dispose();
      done(err);
    });
  });

});
