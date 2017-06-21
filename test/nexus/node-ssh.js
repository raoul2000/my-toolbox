"use strict";

var fs = require('fs'),
  node_ssh = require('node-ssh'),
  path = require('path'),
  assert = require('chai').assert;

var config = {};

describe('run ssh command', function(done) {
  this.timeout(2000);

  before(function() {
    config = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf-8"));
  });

  it('fails to connect with invalid crednetials', function(done) {
    let ssh = new node_ssh();
    ssh.connect({
        host: config.sshConnect.host,
        username: 'invalid',
        password: config.sshConnect.password,
        port: config.sshConnect.port
      })
      .then(() => {
        assert.fail('connection should fail');
      })
      .catch(err => {
        console.error(JSON.stringify(err));
        assert.equal(err.level,'client-authentication');
        ssh.dispose();
        done();
      });
  });

  it('change dir and list', function(done) {
    let ssh = new node_ssh();
    ssh.connect({
        host: config.sshConnect.host,
        username: config.sshConnect.username,
        password: config.sshConnect.password,
        port: config.sshConnect.port
      })
      .then(() => {
        return ssh.execCommand('cd / && ls -rtl', [], {
            cwd: '/',
            stream: 'stdout'
          })
          .then(result => {
            console.log('stdout : ', result.stdout);
            console.log('stderr : ', result.stderr);
            ssh.dispose();
            if( result.stderr.lenth != 0) {
              throw result.stderr;
            }
            done();
          });
      })
      .catch(err => {
        console.error(err);
        ssh.dispose();
        done(err);
      });
  });

  it('fails on incorrect command', function(done) {
    let ssh = new node_ssh();
    ssh.connect({
        host: config.sshConnect.host,
        username: config.sshConnect.username,
        password: config.sshConnect.password,
        port: config.sshConnect.port
      })
      .then(() => {
        return ssh.execCommand('some_cmd', [], {
            cwd: '/',
            stream: 'stdout'
          })
          .then(result => {
            console.log('stdout : ', result.stdout);
            console.log('stderr : ', result.stderr);
            ssh.dispose();
            if( result.stderr.lenth !== 0) {
              throw result.stderr;
            }
            done('should have fail');
          });
      })
      .catch(err => {
        console.error(err);
        ssh.dispose();
        done();
      });
  });

  it('copy local file to remote folder', function(done) {
    var localFilepath = path.join(__dirname, "/../data/tmp/identical.txt");
    let remoteFilepath = "remote.txt";
    let ssh = new node_ssh();
    ssh.connect({
        host: config.sshConnect.host,
        username: config.sshConnect.username,
        password: config.sshConnect.password,
        port: config.sshConnect.port
      })
      .then(() => {
        return ssh.putFile(
            localFilepath,
            remoteFilepath
          );
      })
      .then(() => {
        ssh.dispose();
        done();
      })
      .catch(err => {
        console.error(err);
        ssh.dispose();
        done(err);
      });
  });
});
