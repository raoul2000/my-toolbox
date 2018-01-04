"use strict";

const fs = require('fs'),
  NodeSSH = require('node-ssh'),
  smartCommand = require('../src/app/lib/ssh/smart-command'),
  assert = require('chai').assert;

var config = {};

describe('smart command', function(done) {
  this.timeout(5000);

  before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/config-stage.json", "utf-8"));
  });

  it('returns an error code on invalid command', function(done) {
    let ssh = new NodeSSH();
    ssh.connect(config.ssh)
    .then( () => {
      return smartCommand.run(ssh,{
        "command" : `INVALID COMMAND`
      });
    })
    .then((commandResult) => {
      //console.log(commandResult);
      ssh.dispose();
      assert.isFalse(commandResult.code === 0);
      assert.isString(commandResult.value);
      assert.isNotEmpty(commandResult.stderr);
      assert.isEmpty(commandResult.stdout);
      assert.isUndefined(commandResult.signal);
      done();
    })
    .catch(err => {
      console.log(err);
      ssh.dispose();
      done(err);
    });
  });

  it('runs a simple remote command that returns a string', function(done) {
    let ssh = new NodeSSH();
    ssh.connect(config.ssh)
    .then( () => {
      return smartCommand.run(ssh,{
        "command" : `ls -l`,
        "resultType" : "string"
      });
    })
    .then((commandResult) => {
      //console.log(commandResult);
      ssh.dispose();
      assert.equal(commandResult.code,0);
      assert.isString(commandResult.value);
      assert.isNotEmpty(commandResult.stdout);
      assert.isEmpty(commandResult.stderr);
      assert.isUndefined(commandResult.signal);
      done();
    })
    .catch(err => {
      console.log(err);
      ssh.dispose();
      done(err);
    });
  });

  it('parses result as an array if it contains newline', function(done) {
    let ssh = new NodeSSH();
    ssh.connect(config.ssh)
    .then( () => {
      return smartCommand.run(ssh,{
        "command" : `ls -l`
      });
    })
    .then((commandResult) => {
      //console.log(commandResult);
      ssh.dispose();
      assert.isArray(commandResult.value);
      done();
    })
    .catch(err => {
      console.log(err);
      ssh.dispose();
      done(err);
    });
  });

  it('parses result as string if it does not contains newline', function(done) {
    let ssh = new NodeSSH();
    ssh.connect(config.ssh)
    .then( () => {
      return smartCommand.run(ssh,{
        "command" : `whoami`
      });
    })
    .then((commandResult) => {
      //console.log(commandResult);
      ssh.dispose();
      assert.isString(commandResult.value);
      done();
    })
    .catch(err => {
      console.log(err);
      ssh.dispose();
      done(err);
    });
  });

  it('runs a simple remote command that returns an array', function(done) {
    let ssh = new NodeSSH();
    ssh.connect(config.ssh)
    .then( () => {
      return smartCommand.run(ssh,{
        "command" : `ls -l`,
        //"command" : `. .bash_profile; set -o pipefail; cat $HOME/cfg/eomvar.dtd | grep TOMCAT_ | cut -d ' ' -f 2 | cut -d '_' -f 2 | sort > $TMPDIR/$$.tmp && uniq $TMPDIR/$$.tmp && rm $TMPDIR/$$.tmp`,
        "resultType" : "list"
      });
    })
    .then((commandResult) => {
      //console.log(commandResult);
      ssh.dispose();
      assert.equal(commandResult.code,0);
      assert.isArray(commandResult.value);
      assert.isNotEmpty(commandResult.stdout);
      assert.isEmpty(commandResult.stderr);
      assert.isUndefined(commandResult.signal);
      done();
    })
    .catch(err => {
      console.log(err);
      ssh.dispose();
      done(err);
    });
  });

});
