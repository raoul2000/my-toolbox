"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;


/**
 * Create and returns HTML code for the row representing an artefact
 * @param  {object} artefact artefact description
 * @return {string}          HTML markup for the table row
 */
function createHTMLRowDeploy(artefact) {
  // DO NOT insert newline before tr
  return `<tr id="${artefact.basename}">
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
          <input type="text" name="version" value="" placeholder="version" style="width:110px">
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
          <input type="text" name="installFolder" value="" placeholder="folder" style="width:160px">
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
    <td></td>
  </tr>`;
}

/**
 * Creates and return HTML markup to represent the list of artefacts as a table
 * @param  {array} artefacts list of artefact objects to represent
 * @return {string}           HTML table markup
 */
function createHTMLTableDeploy(artefacts) {
  let HTMLTableBody = '';
  let tableBody = document.getElementById("artefact-list");
  tableBody.innerHTML = ''; // empty table

  artefacts.forEach(function(artefact,index) {
    tableBody.insertAdjacentHTML(
      'beforeend',
      createHTMLRowDeploy(artefact)
    );
    tableBody.lastChild.attributes.id = artefact.basename;
    tableBody.lastChild.dataset.basename = artefact.basename;
    tableBody.lastChild.dataset.version = artefact.metadata.version;
    tableBody.lastChild.dataset.symlink = artefact.metadata.symlink;
    tableBody.lastChild.dataset.installFolder = artefact.metadata.installFolder;
    console.log(artefact);
    //console.log(tableBody);
  });
}

// handle visual state of the artefact deploy list view
let deployUIStateManager = {
  init : function() {
    document.getElementById('artefact-info-panel').style.display = 'none';
    document.getElementById('artefact-list-panel').style.display = 'none';
  },
  artefact_list_ready : function() {
    document.getElementById('artefact-info-panel').style.display = 'none';
    document.getElementById('artefact-list-panel').style.display = 'block';
  },
  empty_artefact_list : function() {
    document.getElementById('artefact-info-panel').style.display = 'block';
    document.getElementById('artefact-list-panel').style.display = 'none';
  }
};

// Toolbar /////////////////////////////////////////////////////////////////////
// user click on the refresh button to reload the artefact list
$('#artefact-list-refresh').on('click',function(ev){
  deployUIStateManager.init();
  ipcRenderer.send('nx-load-artefact-list.start');
});

// user click on the open download folder button
$('#artefact-open-folder').on('click',function(ev){
  ipcRenderer.send('nx-open-folder');
});

// main list //////////////////////////////////////////////////////////////////
// click on artefact list table row
$('#artefact-list').on('click',function(ev){

  let $target    = $(ev.target);            // the HTML element clicked
  let row        = $target.closest('tr');   // the TR wrapper (row)

  let elRow = document.getElementById(row.attr('id'));

  if( $target.closest('.btn-start-row-edit').length > 0 ) {
    // starting row edition ////////////////////////////////////////////////////

    // copy tr.data-???? into corresponding input values
    // convention : data attribute name == input.name
    row.find('input[type="text"]').each(function(index,el){
      let currentValue = elRow.dataset[el.getAttribute('name')];
      el.value = currentValue === 'undefined' ? '' : currentValue;

      // try to set focus on the first input text
      /*
      if(index === 0) {
        el.focus();
      }*/
    });
    row.removeClass().addClass('editing');
  } else
  if($target.closest('.btn-submit-row-edit').length > 0 )  {
    // user submit row value ///////////////////////////////////////////////////
    let newMeta = {}; // stores new entered values : used to update the meta file
    let basename = elRow.dataset['basename']; // this on is never edited
    row.find('input[type="text"]').each(function(index,el){
      let metaName = el.getAttribute('name');
      let newValue =  el.value.trim();

      elRow.dataset[metaName] = newValue === '' ? 'undefined' : newValue;

      $(el).closest('td').find('.value').html(
        newValue === '' ? '<span class="label label-danger">undefined</span>' : newValue
      );
      newMeta[metaName] = newValue === '' ? null : newValue;
    });
    // updates the meta file
    ipcRenderer.send('nx-update-artefact-meta.start', {
      "basename" : basename,
      "metadata" : newMeta
    });
    row.removeClass('editing');
  } else
  if($target.closest('.btn-cancel-row-edit').length > 0 )  {
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
    createHTMLTableDeploy(data);
    deployUIStateManager.artefact_list_ready();
  } else {
    deployUIStateManager.empty_artefact_list();
  }
});

ipcRenderer.on('nx-load-artefact-list.error',function(sender,data){
  console.log(data);
  notify('failed to read download folder','error','error');
});
