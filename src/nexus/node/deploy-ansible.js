"use strict";

var fs = require('fs');
var path = require('path');
const yaml = require('js-yaml');

exports.createPlaybook = function(hosts) {
  return {
    'hosts': hosts,
    'tasks': []
  };
};


exports.createFileDeploymentTasks = function(file, remoteInstallPath) {
  console.log("file", file);
  console.log("remoteInstallPath", remoteInstallPath);

  let tasks = [];
  // The is the versionned folder full path where the war file copied to
  // example : /base/{{ansible_user}}/servlets/module
  let destFolderPath = path.posix.join(
    remoteInstallPath,
    file.installFolder
  );
  // full path of the archive folder
  let archivefilePath = path.posix.join(
    destFolderPath,
    file.basename
  );

  let symlinkPath = path.posix.join(
    remoteInstallPath,
    file.symlink
  );

  // adding tasks to playbook
  tasks.push({
    'name': 'creating versioned folder ' + destFolderPath,
    'file': {
      'path': destFolderPath,
      'state': 'directory'
    }
  });
  tasks.push({
    'name': 'copy file to target machine',
    'copy': {
      'src': file.basename,
      'dest': destFolderPath
    }
  });
  tasks.push({
    'name': 'uncompress war file',
    'shell': `jar -xvf "${file.basename}"`,
    'args': {
      'chdir': destFolderPath,
      'executable': '/bin/bash'
    }
  });

  tasks.push({
    'name': 'update symbolic link',
    'file': {
      'src': destFolderPath,
      'dest': symlinkPath,
      'state': 'link'
    }
  });

  tasks.push({
    'name': 'delete uploaded file',
    'file': {
      'path': archivefilePath,
      'state': 'absent'
    }
  });
  return tasks;
};

exports.savePlaybook = function(playbook, filePath) {
  console.log("savePlaybook",playbook, filePath);
  fs.writeFileSync(filePath, yaml.safeDump([playbook], {
    'json': true
  }));
};
