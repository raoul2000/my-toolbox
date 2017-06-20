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

document.getElementById('btn-deploy-ansible').addEventListener('click',function(ev){
  ev.preventDefault();
  //console.log(ev);
  let selectedFiles = getSelectedFiles();
  console.log(selectedFiles);
  $('#modal-deploy-ansible').modal('show');
});

document.getElementById('btn-create-playbook').addEventListener('click', function(ev){
  // retrieve form values
  let form = document.forms['ansible-form-playbook'];
  let hostname = form.elements['playbook-hostname'].value;
  let deployId = form.elements['deployment-id'].value;

  // validate form
  // TODO

  let arg = {
    'files'    : getSelectedFiles(),
    'hostname' : hostname,
    'deployId' : deployId
  };
  
});
