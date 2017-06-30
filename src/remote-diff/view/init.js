"use strict";
const ipcRenderer = require('electron').ipcRenderer;


// the modal dialog object
let progressModal = {

  elModalDialog : document.querySelector('#rdiff-status-modal .modal-dialog'),
  elAlertInfo   : document.querySelector('#rdiff-status-modal .alert-info'),
  elAlertDanger : document.querySelector('#rdiff-status-modal .alert-danger'),
  /**
   * Display the info panel with an optional HTML content
   */
  showProgress  : function(HTMLContent){
    this.elModalDialog.classList.remove("state-progress","state-error");
    this.elModalDialog.classList.add("state-progress");
    if(HTMLContent !== undefined ) {
      this.elAlertInfo.innerHTML = HTMLContent;
    }
  },
  /**
   * Add HTML content (append) to the progress info box
   */
  addProgressMessage : function(msg) {
    this.elAlertInfo.insertAdjacentHTML('afterbegin',`<div>${msg}</div>`);
  },
  /**
   * Display the error panel (danger) with an HTML content
   */
  showError : function(HTMLContent){
    this.elModalDialog.classList.remove("state-progress","state-error");
    this.elModalDialog.classList.add("state-error");
    this.elAlertDanger.innerHTML = HTMLContent;
  }
};


// user starts remote comparaison
$('#rdiff-compare-form').on('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();

  let form     = document.forms['rdiff-compare-form'];

  let rdiffArg = {
    "src" : { // left
      "connection" : {
        "host"     : form.elements['left-ssh-hostname'].value,
        "port"     : form.elements['left-ssh-port'    ].value,
        "username" : form.elements['left-ssh-username'].value,
        "password" : form.elements['left-ssh-password'].value
      },
      "folderPath" : form.elements['left-ssh-folderpath'].value
    },
    "trg" : { // right
      "connection" :  {
        "host"     : form.elements['right-ssh-hostname'].value,
        "port"     : form.elements['right-ssh-port'    ].value,
        "username" : form.elements['right-ssh-username'].value,
        "password" : form.elements['right-ssh-password'].value
      },
      "folderPath" : form.elements['right-ssh-folderpath'].value
    },
    "options" : {
      "include" : '',
      "exclude" : ''
    }
  };
  console.log(rdiffArg);

  // Set Progress State for modal
  progressModal.showProgress('');
  $('#rdiff-status-modal').modal('show');
  ipcRenderer.send('remoteCompare.start',rdiffArg);
});


// receive remote diff progress message
ipcRenderer.on('remoteCompare.progress',function(event,progress){
  var progressMessage = "";
  switch(progress.task) {
    case "read-source-start": progressMessage = "reading <em>left</em> folder";
    break;
    case "read-source-end": progressMessage = "<em>left</em> file found : "+progress.count;
    break;
    case "read-target-start": progressMessage = "Reading Target file ";
    break;
    case "read-target-end": progressMessage = "Target file found : "+progress.count;
    break;
  }
  progressModal.addProgressMessage(`<div>${progressMessage}</div>`);
});

// error during remote diff
ipcRenderer.on('remoteCompare.error',function(event,err){
  console.log(event);
  console.error(err);
  progressModal.showError(`<div>failed to read remote files</div>`);
});

// remote compare successfully done
ipcRenderer.on('remoteCompare.done',function(event,data){
  setTimeout(function() {
    $('#rdiff-status-modal').modal('hide');
  },800);
});
