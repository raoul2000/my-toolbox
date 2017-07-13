"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

// user select the SSH deploy menu item
document.getElementById('btn-deploy-ssh').addEventListener('click',function(ev){
  ev.preventDefault();
  console.log(ev);
  if(validateDeploy()) {
    $('#modal-deploy-ssh').modal('show');
  }
});

// user submit a valide SHH deploy form : start deploy
$('#deploy-ssh-form').on('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();

  // retrieve form values
  //
  let form     = document.forms['deploy-ssh-form'];
  let hostname = form.elements['ssh-hostname'].value;
  let port = form.elements['ssh-port'].value;
  port = port.length === 0 ? 22 : port;
  let username = form.elements['ssh-username'].value;
  let password = form.elements['ssh-password'].value;
  let targetPath = form.elements['ssh-target-path'].value;

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
  let trEl = document.querySelector(`tr[data-basename="${data.basename}"]`);
  trEl.lastElementChild.innerHTML = "done";
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
  
  let trEl = document.querySelector(`tr[data-basename="${data.file.basename}"]`);
  trEl.lastElementChild.innerHTML = data.progressMessage;
  console.log(data);
  if( data.info && data.info.operation === "upload") {

    trEl.lastElementChild.innerHTML = `<div class="progress" style="min-width:100px">
                          <div id="m01-progress" class="progress-bar" role="progressbar" style="width:${data.info.progress}%"
                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>`;
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
  let trEl = document.querySelector(`tr[data-basename="${data.file.basename}"]`);
  trEl.lastElementChild.innerHTML = "ERROR";
  console.log(data);
});
