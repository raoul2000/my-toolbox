"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

$('#artefact-list').on('click',function(ev){
  let $target    = $(ev.target);            // the HTML element clicked
  let row        = $target.closest('tr');   // the TR wrapper (row)
  let artefact   = row.data('artefact');
});


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
        <div class="edit" style="display:none">
          <input type="text" name="version" value="${artefact.metadata.version || ''}" placeholder="" style="width:80px">
          <button type="button" class="btn btn-default btn-xs btn-inline-edit-ok">
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
          </button>
          <button type="button" class="btn btn-default btn-xs btn-inline-edit-cancel">
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </td>
    <td nowrap class="module-symlink">
      <div class="inline-edit-group">
        <div class="value">
              ${artefact.metadata.symlink || '<span class="label label-danger">undefined</span>'}
        </div>
        <div class="edit" style="display:none">
          <input type="text" name="symlink" value="${artefact.metadata.symlink || ''}" placeholder="">
          <button type="button" class="btn btn-default btn-xs btn-inline-edit-ok">
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
          </button>
          <button type="button" class="btn btn-default btn-xs btn-inline-edit-cancel">
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </td>
    <td nowrap class="module-target-folder">
      <div class="inline-edit-group">
        <div class="value">
          ${artefact.metadata.installFolder || '<span class="label label-danger">undefined</span>'}
        </div>
        <div class="edit" style="display:none">
          <input type="text" name="symlink" value="${artefact.metadata.installFolder || ''}" placeholder="" style="width:80px">
          <button type="button" class="btn btn-default btn-xs btn-inline-edit-ok">
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
          </button>
          <button type="button" class="btn btn-default btn-xs btn-inline-edit-cancel" >
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </button>
        </div>

      </div>
    </td>
    <td></td>
  </tr>
  `;
}

function createHTMLTableDeploy(artefacts) {
  let HTMLTableBody = '';
  artefacts.forEach(function(artefact,index) {
      HTMLTableBody += createHTMLRowDeploy(artefact);
  });
  return HTMLTableBody;
}


$('#artefact-list').on('click',function(ev){

  let $target    = $(ev.target);            // the HTML element clicked
  let row        = $target.closest('tr');   // the TR wrapper (row)

  if( $target.closest('.value').length > 0 ) {
    console.log("start inline edit");
    let inlineEditGroup = $target.closest('.inline-edit-group').first();

    inlineEditGroup.find('.value').hide();
    /*
    inlineEditGroup.find('.edit input').one('blur',function(ev){
      console.log("blur");
    });
    */
    inlineEditGroup.find('.edit').show();
    inlineEditGroup.find('.edit input').focus();
  }
  else if( $target.closest('.btn-inline-edit-ok').length > 0 ) {
    console.log("inline edit : ok");
    let inlineEditGroup = $target.closest('.inline-edit-group').first();

    let input = inlineEditGroup.find('input').first();
    let newVal = input.val().trim();
    if(newVal.length !== 0) {
      inlineEditGroup.find('.value').html(input.val());
    }

    inlineEditGroup.find('.edit').hide();
    inlineEditGroup.find('.value').show();

  }
  else if( $target.closest('.btn-inline-edit-cancel').length > 0 ) {
    console.log("inline edit : cancel");
    let inlineEditGroup = $target.closest('.inline-edit-group').first();

    inlineEditGroup.find('.edit').hide();
    inlineEditGroup.find('.value').show();
  }
});

ipcRenderer.send('nx-load-artefact-list.start');
console.log("nx-load-artefact-list.start");

ipcRenderer.on('nx-load-artefact-list.done',function(sender,data){
  console.log(data);
  var tableBody = document.getElementById("artefact-list");
  tableBody.insertAdjacentHTML(
    'beforeend',
    createHTMLTableDeploy(data)
  );

});

ipcRenderer.on('nx-load-artefact-list.error',function(sender,data){
  console.log(data);
  notify('failed to read download folder','error','error');
});
