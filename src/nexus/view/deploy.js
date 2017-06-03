"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;


/**
 * Create and returns HTML code for the row representing an artefact
 * @param  {object} artefact artefact description
 * @return {string}          HTML markup for the table row
 */
function createHTMLRowDeploy(artefact) {
  return `
  <tr data-info='${JSON.stringify(artefact)}'>
    <td>
      <input class="chk-module" type="checkbox"  value="1">
    </td>
    <td>
      <div class="filename">${artefact.basename}</div>
      <div class="module-name">${artefact.moduleName || ''}</div>
    </td>

    <td  nowrap class="module-version">
      <div class="inline-edit-group">
        <div class="value">
          ${artefact.metadata.version || '<span class="label label-danger">undefined</span>'}
        </div>
        <div class="edit">
          <input type="text" name="version" value="" placeholder="version" style="width:80px">
        </div>
      </div>
    </td>

    <td nowrap class="module-symlink">
      <div class="inline-edit-group">
        <div class="value">
          ${artefact.metadata.symlink || '<span class="label label-danger">undefined</span>'}
        </div>
        <div class="edit">
          <input type="text" name="symlink" value="" placeholder="symlink" style="width:80px">
        </div>
      </div>
    </td>

    <td nowrap class="module-target-folder">
      <div class="inline-edit-group">
        <div class="value">
          ${artefact.metadata.installFolder || '<span class="label label-danger">undefined</span>'}
        </div>
        <div class="edit">
          <input type="text" name="folder" value="" placeholder="folder" style="width:80px">
        </div>
      </div>
    </td>
    <td> <!-- action col -->
      <div class="value">
        <button type="button" class="btn btn-default btn-xs btn-start-row-edit">
          <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
        </button>
      </div>
      <div class="edit">
        <button type="button" class="btn btn-default btn-xs btn-submit-row-edit" >
          <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
        </button>
        <button type="button" class="btn btn-default btn-xs btn-cancel-row-edit">
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </button>
      </div>
    </td>
  </tr>
  `;
}

/**
 * Creates and return HTML markup to represent the list of artefacts as a table
 * @param  {array} artefacts list of artefact objects to represent
 * @return {string}           HTML table markup
 */
function createHTMLTableDeploy(artefacts) {
  let HTMLTableBody = '';
  artefacts.forEach(function(artefact,index) {
      HTMLTableBody += createHTMLRowDeploy(artefact);
  });
  return HTMLTableBody;
}

// handle visual state of the artefact deploy list view
let deployUIStateManager = {
  init : function() {
    document.getElementById('artefact-info-panel').style.display = 'none';
    document.getElementById('artefact-list-panel').style.display = 'none';
  },
  artefact_list_ready : function() {
    $('#artefact-info-panel').hide();
    $('#artefact-list-panel').show();
  },
  empty_artefact_list : function() {
    $('#artefact-list-panel').hide();
    $('#artefact-info-panel').show();
  }
};

// user click on the refresh button to reload the artefact list
$('#artefact-list-refresh').on('click',function(ev){
  deployUIStateManager.init();
  ipcRenderer.send('nx-load-artefact-list.start');
});

// click on artefact list table row
$('#artefact-list').on('click',function(ev){

  let $target    = $(ev.target);            // the HTML element clicked
  let row        = $target.closest('tr');   // the TR wrapper (row)

  if( $target.closest('.btn-start-row-edit').length > 0 ) {
    // starting row edition ////////////////////////////////////////////////////
    row.removeClass().addClass('editing');
  } else if($target.closest('.btn-submit-row-edit').length > 0 )  {
    // user submit row value ///////////////////////////////////////////////////
    row.removeClass('editing');
  } else if($target.closest('.btn-cancel-row-edit').length > 0 )  {
    // user cancel row value modif /////////////////////////////////////////////
    row.removeClass('editing');
  }
});


ipcRenderer.send('nx-load-artefact-list.start');
console.log("nx-load-artefact-list.start");

//////////////////////////////////////////////////////////////////
// Custom Event handlers
//

ipcRenderer.on('nx-load-artefact-list.done',function(sender,data){
  console.log(data);
  if(data.length > 0 ){
    var tableBody = document.getElementById("artefact-list");
    tableBody.innerHTML = '';
    tableBody.insertAdjacentHTML(
      'beforeend',
      createHTMLTableDeploy(data)
    );
    deployUIStateManager.artefact_list_ready();
  } else {
    deployUIStateManager.empty_artefact_list();
  }
});

ipcRenderer.on('nx-load-artefact-list.error',function(sender,data){
  console.log(data);
  notify('failed to read download folder','error','error');
});
