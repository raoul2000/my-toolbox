"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

function showDeployStatus(){
  $('#deploy-ssh-status').slideDown(100);
  $('#deploy-ssh-form').slideUp(100);
}

function hideDeployStatus(){
  $('#deploy-ssh-status').slideUp(100);
  $('#deploy-ssh-form').slideDown(100);
}

// user select the SSH deploy menu item
document.getElementById('btn-deploy-ssh').addEventListener('click',function(ev){
  ev.preventDefault();
  console.log(ev);

  // check selected files are ok
  let selectedFiles = getSelectedFiles();
  console.log(selectedFiles);
  if( selectedFiles.length === 0) {
    notify('Select at least one file to deploy', 'warning', 'No file selected');
  } else {
    // let's validate that each file as required info
    let invalidFile = selectedFiles.find( (file) => {
      return Object.keys(file).find( key => {
        return file[key].length === 0 || file[key] === 'null';
      });
    });
    if( invalidFile) {
      notify("One or more selected files have undefined information","error","Invalid File(s) Info");
    } else {
      hideDeployStatus();
      $('#modal-deploy-ssh').modal('show');
    }
  }
});

// user submit a valide SHH deploy form : start deploy
$('#deploy-ssh-form').on('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();
  //showDeployStatus();

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
  let trEl = document.querySelector(`tr[data-basename="${data.file.basename}"]`);
  trEl.lastElementChild.innerHTML = data.progressMessage;
  console.log(data);
});

// Error during SSH deployment for a file
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
