"use strict";
const electron = require('electron');
const config = require('../../config').config;
const userConfig = require('../../config').userConfig;
const ipcRenderer = electron.ipcRenderer;

let defaultLoaded = false;
// populate initial sshdeploy modal with last values used (if available)
function populateDefaultSSHDeploy() {
  if( ! defaultLoaded) {
    let form     = document.forms['deploy-ssh-form'];
    form.elements['ssh-hostname'].value = form.elements['ssh-hostname'].value || config.get('sshDeploy.last.hostname');
    form.elements['ssh-port'].value = form.elements['ssh-port'].value || config.get('sshDeploy.last.port');
    form.elements['ssh-username'].value = form.elements['ssh-username'].value || config.get('sshDeploy.last.username');
    form.elements['ssh-target-path'].value = form.elements['ssh-target-path'].value || config.get('sshDeploy.last.target-path');
    defaultLoaded = true;
  }
}

// user select the SSH deploy menu item
document.getElementById('btn-deploy-ssh').addEventListener('click',function(ev){
  ev.preventDefault();
  console.log(ev);
  if(validateDeploy()) {
    populateDefaultSSHDeploy();
    $('#modal-deploy-ssh').modal('show');
  }
});

// user submit a valide SHH deploy form : start deploy
$('#deploy-ssh-form').on('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();

  // retrieve form values
  let form     = document.forms['deploy-ssh-form'];
  let hostname = form.elements['ssh-hostname'].value;
  let port = form.elements['ssh-port'].value;
  port = port.length === 0 ? 22 : port;
  let username = form.elements['ssh-username'].value;
  let password = form.elements['ssh-password'].value;
  let targetPath = form.elements['ssh-target-path'].value;

  // save last connection settings
  userConfig.set("sshDeploy.last.hostname", hostname);
  userConfig.set("sshDeploy.last.port", port);
  userConfig.set("sshDeploy.last.username", username);
  userConfig.set("sshDeploy.last.target-path", targetPath);

  $('#modal-deploy-ssh').one('hidden.bs.modal', function (e) {
    ipcRenderer.send('nx-ssh-deploy.start', {
      'ssh' : {
        'host' : hostname,
        'port' : port,
        'username' : username,
        'password' : password
      },
      'targetPath' : targetPath,
      'files' : getSelectedFiles()
    });
  })
  .modal('hide');
});

// Event handlers //////////////////////////////////////////////////////////////

// one file could be deployed
//
// data : {
//     basename: 'emCheckin-2.4.1.war',
//    installFolder: 'checkin-2.4.1',
//    symlink: 'checkin',
//    version: '2.4.1'
// }
ipcRenderer.on('nx-ssh-deploy.done',function(sender,data){

  let row = $(`tr[data-basename="${data.basename}"]`);
  row.find('.ssh-deploy-progress').hide();
  row.find('.ssh-deploy-success').show();
  row.find('.ssh-deploy-error').hide();
  row.find('.ssh-deploy-status').show();
  console.log(data);
});

// SSH deploy progress event
//
// data = {
//  "file" : {
//     basename: 'emCheckin-2.4.1.war',
//    installFolder: 'checkin-2.4.1',
//    symlink: 'checkin',
//    version: '2.4.1'
//  },
//  "progressMessage" : "message here"
// }
ipcRenderer.on('nx-ssh-deploy.progress',function(sender,data){
  console.log('nx-ssh-deploy.progress',data);

  let row = $(`tr[data-basename="${data.file.basename}"]`);
  row.find('.ssh-deploy-progress').show();
  row.find('.ssh-deploy-status').hide();

  //trEl.lastElementChild.innerHTML = data.progressMessage;
  console.log(data);
  if( data.info && data.info.operation === "upload") {
    row.find('.progress-bar').first().css('width', "" + data.info.percent + "%");
    row.find('.progress-percent .percent-value').first().text(data.info.percent + "%");
  }
});

// Error during SSH deployment for a file
//
// data = {
//  "file" : {
//     basename: 'emCheckin-2.4.1.war',
//    installFolder: 'checkin-2.4.1',
//    symlink: 'checkin',
//    version: '2.4.1'
//  },
//  "error" : object
// }
ipcRenderer.on('nx-ssh-deploy.error',function(sender,data){
  let row = $(`tr[data-basename="${data.file.basename}"]`);
  row.find('.ssh-deploy-progress').hide();
  row.find('.ssh-deploy-status').show();
  row.find('.ssh-deploy-success').hide();
  row.find('.ssh-deploy-error').show();  
  console.log(data);
});
