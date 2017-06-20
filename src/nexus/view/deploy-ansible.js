"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

function getSelectedFiles() {
  let resultSet = [];
  document.querySelectorAll('#nexus-deploy-mod input.chk-module')
  .forEach(item => {
    if(item.checked) {
      resultSet.push(item.parentNode.parentNode.dataset);
    }
  });
  return resultSet;
}

function hidePlaybookStatus() {
  document.querySelectorAll('#modal-deploy-ansible #ansible-playbook-status .alert')
    .forEach( el => el.style.display = 'none');
}

document.getElementById('btn-deploy-ansible').addEventListener('click',function(ev){
  ev.preventDefault();
  //console.log(ev);
  let selectedFiles = getSelectedFiles();
  console.log(selectedFiles);
  hidePlaybookStatus();
  $('#modal-deploy-ansible').modal('show');
});


document.getElementById('btn-create-playbook').addEventListener('click', function(ev){
  hidePlaybookStatus();
  // retrieve form values
  let form     = document.forms['ansible-form-playbook'];
  let hostname = form.elements['playbook-hostname'].value;
  let deployId = form.elements['deployment-id'].value;

  // validate form
  // TODO

  ipcRenderer.send('nx-create-playbook.start',{
    'files'    : getSelectedFiles(),
    'hostname' : hostname,
    'deployId' : deployId,
    'remoteInstallBasePath' : '/remote/base/path'
  });
});

ipcRenderer.on('nx-create-playbook.done',function(sender,data){
  let elSuccess = document.querySelector('#modal-deploy-ansible #ansible-playbook-status .alert-success');
  elSuccess.innerHTML = 'The playbook file has been created in <code>'+data+'</code>';
  elSuccess.style.display = 'block';
  console.log(data);
});
ipcRenderer.on('nx-create-playbook.error',function(sender,err){
  let elDanger = document.querySelector('#modal-deploy-ansible #ansible-playbook-status .alert-danger');
  elDanger.innerHTML = `<h2>Oups : something went wrong</h2>
  <pre>${JSON.stringify(err)}</pre>
  `;
  elDanger.style.display = 'block';
  console.error(err);
});
