"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

/**
 * Focus is leaving the input  control : validate it value
 * or display tool tip on error
 *
 * @param  {HTMLElement} input  the input control instance
 * @param  {function} validator function alidator (returns TRUE/FALSE)
 */
function onTextInputBlur(input, validator) {
  let inputVal = input.value.trim();
  let validationError = validator(inputVal);
  let $input = $(input);
  if( validationError ) {
    $input.attr('data-original-title',validationError);
    $input.tooltip('show');
    setTimeout(function(){
      $input.tooltip('hide');
    },2000);
  }
}

function onTextInputKeyup(input, validator) {
  let inputVal = input.value.trim();
  let validationError = validator(inputVal);
  let $input = $(input);
  if( validationError ) {
    $input.closest('.form-group').first().addClass('has-error  invalid-value');
  } else {
    $input.closest('.form-group').first().removeClass('has-error  invalid-value');
  }
  // update the create playbook buttons
  $('#btn-create-playbook').attr('disabled', $('#ansible-form-playbook .invalid-value').length !== 0);
}


$('#playbook-hostname, #deployment-id').on('keyup', function(ev){
  onTextInputKeyup(ev.target,function(val){
    if( val.length === 0 ) {
      return "Please enter a value";
    }
  });
}).on('blur', function(ev){
  onTextInputBlur(ev.target,function(val){
    if( val.length === 0 ) {
      return "Please enter a value";
    }
  });
});



function hideSSHDeployStatus() {
  document.querySelectorAll('#modal-deploy-ssh #deploy-ssh-status .alert')
    .forEach( el => el.style.display = 'none');
}

function showDeployStatus(){
  $('#deploy-ssh-status').slideDown(100);
  $('#ssh-form-playbook').slideUp(100);
}

function hideDeployStatus(){
  $('#deploy-ssh-status').slideUp(100);
  $('#ssh-form-playbook').slideDown(100);
}


document.getElementById('btn-deploy-ssh').addEventListener('click',function(ev){
  ev.preventDefault();
  console.log(ev);

  let selectedFiles = getSelectedFiles();
  console.log(selectedFiles);
  if( selectedFiles.length === 0) {
    notify('Select one or more files to deploy', 'warning', 'title');
  } else {
    //hideSSHDeployStatus();
    hideDeployStatus();
    $('#modal-deploy-ssh').modal('show');
  }
});


document.getElementById('btn-start-ssh-deploy').disabled = false;
document.getElementById('btn-start-ssh-deploy').addEventListener('click', function(ev){
  showDeployStatus();
  // retrieve form values
  //
  /*
  let form     = document.forms['ssh-form-playbook'];
  let hostname = form.elements['playbook-hostname'].value;
  let deployId = form.elements['deployment-id'].value;
  */
  // validate form
  // TODO


  ipcRenderer.send('nx-ssh-deploy.start',{
  });
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
