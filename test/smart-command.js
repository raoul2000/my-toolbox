"use strict";

var fs = require('fs'),
  node_ssh = require('node-ssh'),
  path = require('path'),
  smartCommand = require('../src/app/lib/ssh/smart-command'),
  assert = require('chai').assert;

var config = {};

describe('smart command', function(done) {
  this.timeout(5000);

  before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/config-stage.json", "utf-8"));
  });

  it('fails if incorrect connection info are provided', function(done) {
    smartCommand.run({
      "ssh" : null
    })
    .then(() => {
      done(new Error("should fail"));
    })
    .catch(err => {
      done();
    });
  });

  it('fails if connection credentials are wrong', function(done) {
    smartCommand.run({
      "ssh" : {
        "host": "127.0.0.1",
        "port" : 22,
        "username": "root",
        "password" : "invalid_password"
      }
    })
    .then(() => {
      done(new Error("should fail"));
    })
    .catch(err => {
      done();
    });
  });

  it('runs a simple remote command', function(done) {
    smartCommand.run({
      "ssh" : config.ssh,
      "command" : `ls -l`,
      //"command" : `. .bash_profile; set -o pipefail; cat $HOME/cfg/eomvar.dtd | grep TOMCAT_ | cut -d ' ' -f 2 | cut -d '_' -f 2 | sort > $TMPDIR/$$.tmp && uniq $TMPDIR/$$.tmp && rm $TMPDIR/$$.tmp`,
      "resultType" : "list"
    })
    .then((result) => {
      console.log(result);
      assert.equal(result.code,0);
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });

  it('run a simple remote command', function(done) {
    smartCommand.run({
      "ssh" : config.ssh,
      "command" : `ls -l`,
      //"command" : `. .bash_profile; set -o pipefail; cat $HOME/cfg/eomvar.dtd | grep TOMCAT_ | cut -d ' ' -f 2 | cut -d '_' -f 2 | sort > $TMPDIR/$$.tmp && uniq $TMPDIR/$$.tmp && rm $TMPDIR/$$.tmp`,
      "resultType" : "list3"
    })
    .then((result) => {
      console.log(result);
      assert.equal(result.code,0);
      done();
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
  });


});
