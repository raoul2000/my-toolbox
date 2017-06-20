"use strict";

var ansible = require('../../src/nexus/node/deploy-ansible'),
  fs = require('fs'),
  assert = require('chai').assert;
const path = require('path');

var config = {};

describe('copy file', function(done) {

  it('successfully copy file', function(done) {
    let playbook = ansible.createPlaybook('hostname')
    playbook.tasks = playbook.tasks.concat(
      ansible.createFileDeploymentTasks({
        basename: 'emCheckin-2.4.1.war',
        installFolder: 'checkin-2.4.1',
        symlink: 'checkin',
        version: '2.4.1'
      }, '/remote/install/path1'),
      ansible.createFileDeploymentTasks({
        basename: 'emCheckin-3.0.0.war',
        installFolder: 'checkin-3.0.0',
        symlink: 'checkin',
        version: '3.0.0'
      }, '/remote/install/path2')
    );
		ansible.savePlaybook(playbook,path.join(__dirname,'..','data','playbook.yaml'));
    done();

  });
});
