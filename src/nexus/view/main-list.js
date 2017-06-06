"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

/**
 * Create HTML TR element for tha module
 *
 * @param  {string} id   the module id
 * @param  {object} data module reference description
 * @return {string}      HTML for the module table row
 */
function createHTMLModuleRow(id, data) {
  return `
  <tr id="${id}" class="init" >
    <td>
      <div class="btn-group">
        <button type="button" class="btn btn-sm btn-default chk-module" title="download version info">
          <span class="glyphicon glyphicon-download" aria-hidden="true"></span>
        </button>
        <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="caret"></span>
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu nx-external-link-open">
          <li class="dropdown-header">Open links</li>
          <li title="open documentation in default browser"><a href="${data.url.doc}">Documentation</a></li>
          <li title="open CHANGES in default browser"><a href="${data.url.changes}">Changes</a></li>
        </ul>
      </div>

    </td>
    <td>${data.id}</td>
    <td>${data.name}</td>
    <td nowrap="true">
      <div class="sel-package-widget">
        <select class="sel-version-cat" name="">
          <option value="release" selected="selected">release</option>
          <option value="snapshot">snapshot</option>
        </select>
        <select class="sel-version-val" name="">
        </select>
      </div>
      <div class="status">
        <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span> Loading ...
      </div>
    </td>
    <td nowrap="true">
      <div class="action">
        <button type="button" class="but-download-start btn btn-default btn-xs" title="start download">
          <span class="glyphicon glyphicon-play"  aria-hidden="true"></span>
        </button>
        <button type="button" disabled class="but-download-cancel btn btn-default btn-xs" title="cancel download">
          <span class="glyphicon glyphicon-stop" aria-hidden="true"></span>
        </button>
      </div>
    </td>
    <td>
      <div class="download-progress">
        <div class="progress-percent">
          <span class="percent-value">0%</span>
          <span class="downloaded-filename"></span>
        </div>

        <div class="progress" style="min-width:100px">
          <div id="${id}-progress" class="progress-bar" role="progressbar"
            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          </div>
        </div>
      </div>

      <div class="download-status" style="display:none">
        <div class="download-success">
          <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
        </div>
        <div class="download-error">
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
        <span class="downloaded-filename"></span>
      </div>

    </td>
  </tr>
  `;
}

/**
 * Create the content of the module table for all modules ref
 * objects passed as argument
 * @param  {object} moduleRef module references object (key = module id)
 * @return {string}           HTML for the tbody content
 */
function createHTMLTable(moduleRef) {
  let HTMLTableBody = '';
  Object.keys(moduleRef).forEach(function(key,index) {
      // key: the name of the object key
      // index: the ordinal position of the key within the object
      HTMLTableBody += createHTMLModuleRow(key, moduleRef[key]);
  });
  return HTMLTableBody;
}

/**
 * User Interface State Manager
 */
const uiStateManager = {
  download_module_start : function(row, $target) {
    console.log("starting");
    row.find('.progress-percent .percent-value').first().text("0%");
    row.find('.progress-bar').first().css('width', "0%");
    row.find('.download-status').hide();
    row.find('.download-progress').show();
    $target.closest('.but-download-start').first().prop('disabled', true);
    row.find('.but-download-cancel').prop('disabled', false);
    row.find('.sel-version-val').first().prop('disabled',true);
    row.find('.sel-version-cat').first().prop('disabled',true);
  },
  download_module_done : function(row) {
    row.find('.download-progress').hide();
    row.find('.download-success').show();
    row.find('.download-error').hide();
    row.find('.download-status').show();
    row.find('.progress-percent .percent-value').first().text("100%");
    row.find('.progress-bar').first().css('width',"100%");
    row.find('.but-download-cancel').prop('disabled', true);
    row.find('.but-download-start').prop('disabled', false);
    row.find('.sel-version-val').first().prop('disabled',false);
    row.find('.sel-version-cat').first().prop('disabled',false);
  },
  download_module_progress : function(row, percent) {
    row.find('.progress-bar').first().css('width', "" + percent + "%");
    row.find('.progress-percent .percent-value').first().text(percent + "%");
    //row.find('.progress-percent .downloaded-filename').text("filename.war");
  },
  download_module_cancel : function(row, $button) {
    row.find('.download-progress').hide();
    row.find('.download-status').hide();
    row.find('.progress-percent .percent-value').text("");
    row.find('.progress-percent .downloaded-filename').text("");
    row.find('.but-download-cancel').prop('disabled', true);
    row.find('.but-download-start').prop('disabled', false);
    row.find('.but-download-start').prop('disabled', false);
    row.find('.sel-version-val').first().prop('disabled',false);
    row.find('.sel-version-cat').first().prop('disabled',false);
  },
  download_module_error : function(row) {
    row.find('.download-progress').hide();
    row.find('.download-success').hide();
    row.find('.download-error').show();
    row.find('.download-status').show();
    row.find('.but-download-cancel').prop('disabled', true);
    row.find('.but-download-start').prop('disabled', false);
    row.find('.sel-version-val').first().prop('disabled',false);
    row.find('.sel-version-cat').first().prop('disabled',false);
  },
  loading_version : function(row) {
    row.removeClass().addClass('loading-version');
  }
};
// in order to not create one event handler per row, delegate event handle to the
// tbody element.
$('#module-list').on('click',function(ev){

  let $target    = $(ev.target);            // the HTML element clicked
  let row        = $target.closest('tr');   // the TR wrapper (row)
  let moduleId   = row.prop('id');          // the module Id
  let modVersion = row.data('version');     // module version data (or null)

  console.log("moduleId",moduleId);
  //////////////////////////////////////////////////////////////////////////////
  if( $target.closest('.but-download-cancel').length > 0 ) {
    // usser canceled the current download (in progress)
    console.log('but-download-cancel');
    let $button = $target.closest('.but-download-cancel').first();

    // update UI
    uiStateManager.download_module_cancel(row);

    ipcRenderer.send('nx-download-mod.cancel',{ moduleId : moduleId });

  } else  //////////////////////////////////////////////////////////////////////
    if( $target.closest('.chk-module').length > 0 ) {
    // User is asking to load version info for this module
    // if version info has not already been retreieved, fetch it now
    //
    console.log("downloading version data for module "+moduleId);
    // update UI
    uiStateManager.loading_version(row);
    // start version download
    ipcRenderer.send('nx-fetch-version.start', row.data('ref'));

  } else ///////////////////////////////////////////////////////////////////////
    if( $target.closest('.but-download-start').length > 0 ) {
      // user starts the download of this module and for the selected version number
      // and category ('release' or 'snapshot')

      // update UI
      uiStateManager.download_module_start(row,$target);

      // read user input : version number and category
      let selVersion = row.find('.sel-version-val > option:selected').prop('value');
      let selCat     = row.find('.sel-version-cat > option:selected').prop('value');

      let arg = {
        moduleId : moduleId,
        version  : selVersion,
        cat      : selCat,  // 'release' or 'snapshot',
        url      : row.data('ref').url
      };
      ipcRenderer.send('nx-download-mod.start',arg);
  } else ////////////////////////////////////////////////////////////////////////
  if( $target.closest('.nx-external-link-open').length >0 ) {
    // user wants to open URL in external browser
    ev.preventDefault();
    ev.stopPropagation();

    ipcRenderer.send('core-open-url',$target.prop('href'));
  }
});

// handle dependent select box : release/snapshot - version
$('#module-list').on('change',function(ev){

  let $target = $(ev.target);
  let row = $target.closest('tr');
  let moduleId = row.prop('id');

  if( $target.closest('.sel-version-cat').length > 0 ) {
    let $selCat        = $target.closest('.sel-version-cat').first();
    let $selVersion    = row.find('.sel-version-val');
    let selectedOption = $selCat.find('option:selected').prop('value');

    // clean and then populate version select list
    $selVersion.children('option').remove();
    row.data('version')[selectedOption].forEach(function(optValue){
      $selVersion.append($("<option></option>")
       .attr("value",optValue)
       .text(optValue));
    });
  }
});


$('#btn-reload-module-ref').on('click', function(){
  $('#module-list-panel, #init-error-panel').hide();
  $('#module-list').empty();
  ipcRenderer.send('nx-load-module-ref.start');
});
//////////////////////////////////////////////////////////////////
// Custom Event handlers
//

// starts the creation of the module list
ipcRenderer.send('nx-load-module-ref.start');

// creates the HTML and add it inside tbody.
// data is the module-ref object
ipcRenderer.on('nx-load-module-ref.done',function(sender, data){
    console.log("nx-load-module-ref.done",data);
    var tableBody = document.getElementById("module-list");
    tableBody.insertAdjacentHTML(
      'beforeend',
      createHTMLTable(data)
    );

    // attach to each module row (TR) it reference info object
    $('#module-list tr ').each(function(index){
      let $this = $(this);
      $this.data('ref', data[$this.prop('id')]);
    });
    $('#module-list-panel').show();
});

// show the init error panel
ipcRenderer.on('nx-load-module-ref.error',function(sender, error){
  console.error(error);
  $('#module-ref-source').text(error.path);
  $('#init-error-panel').show();
});

// update GUI on download progress for a specific module
ipcRenderer.on('nx-download-mod.progress', function(sender, data){
    console.log(data);
    let row     = $('#'+data.moduleId);
    let percent = Math.round(data.progress.percent * 100);

    uiStateManager.download_module_progress(row, percent);
    // update UI
});

// the download of the module file has been completed successfully
ipcRenderer.on('nx-download-mod.done',function(sender, data){
  console.log(data);
  let row     = $('#'+data.moduleId);
  uiStateManager.download_module_done(row);
  // update UI
});

// the module file download could not be completed
ipcRenderer.on('nx-download-mod.error', function(sender, data){
  console.log('nx-download-mod.error',data);
  if( data.error) {
    switch (data.error.code) {
      case "ESOCKETTIMEDOUT":
        notify("Connection timeout : the server did not reply within the configured delay",'error','download failed');
        break;
      default:
        notify(data.message,'error','download failed');
    }
  } else {
    notify(data.message,'error','download failed');
  }
  let row     = $('#'+data.input.moduleId);
  uiStateManager.download_module_error(row);
});

// version info have been retrieved successfully
ipcRenderer.on('nx-fetch-version.done',function(event,module){
  let row = $('#'+module.id);
  row.data('version',module.version);

  // update UI
  row.find('.sel-version-cat').trigger('change');
  row.removeClass().addClass('loaded');
});

// version info could not be retrieved
ipcRenderer.on('nx-fetch-version.error',function(event,module){
  notify('Failed to retrieve module information', 'error','error');
  let row = $('#'+module.id);

  // update UI
  //row.find('.sel-version-cat').trigger('change');
  row.removeClass().addClass('init danger');
});
