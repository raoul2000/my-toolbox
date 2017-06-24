"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;


function hideSSHDeployStatus() {
  document.querySelectorAll('#modal-deploy-ssh #deploy-ssh-status .alert')
    .forEach( el => el.style.display = 'none');
}

function showDeployStatus(){
  $('#deploy-ssh-status').slideDown(100);
  $('#deploy-ssh-form').slideUp(100);
}

function hideDeployStatus(){
  $('#deploy-ssh-status').slideUp(100);
  $('#deploy-ssh-form').slideDown(100);
}


document.getElementById('btn-deploy-ssh').addEventListener('click',function(ev){
  ev.preventDefault();
  console.log(ev);

  let selectedFiles = getSelectedFiles();
  console.log(selectedFiles);
  if( selectedFiles.length === 0) {
    notify('Select one or more files to deploy', 'warning', 'title');
  } else {
    hideDeployStatus();
    $('#modal-deploy-ssh').modal('show');
  }
});

$('#deploy-ssh-form').on('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();
  showDeployStatus();

  // retrieve form values
  //
  let form     = document.forms['deploy-ssh-form'];
  let hostname = form.elements['ssh-hostname'].value;
  let port = form.elements['ssh-port'].value;
  port = port.length === 0 ? 22 : port;
  let username = form.elements['ssh-username'].value;
  let password = form.elements['ssh-password'].value;
  let targetPath = form.elements['ssh-target-path'].value;

  let arg = {
    'ssh' : {
      'host' : hostname,
      'port' : port,
      'username' : username,
      'password' : password
    },
    'files' : getSelectedFiles()
  };
  ipcRenderer.send('nx-ssh-deploy.start',arg);
});


ipcRenderer.on('nx-ssh-deploy.done',function(sender,data){
  let elSuccess = document.querySelector('#modal-deploy-ansible #ansible-playbook-status .alert-success');
  elSuccess.innerHTML = 'The playbook file has been created in <code>'+data+'</code>';
  elSuccess.style.display = 'block';
  console.log(data);
});
ipcRenderer.on('nx-ssh-deploy.error',function(sender,err){
  let elDanger = document.querySelector('#modal-deploy-ansible #ansible-playbook-status .alert-danger');
  elDanger.innerHTML = `<h2>Oups : something went wrong</h2>
  <pre>${JSON.stringify(err)}</pre>
  `;
  elDanger.style.display = 'block';
  console.error(err);
});
