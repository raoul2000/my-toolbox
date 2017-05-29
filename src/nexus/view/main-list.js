"use strict";
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

function createHTMLModuleRow(id, data) {
  return `
  <tr id="${id}" class="init" >
    <td>
      <input class="chk-module" type="checkbox"  value="1">
    </td>
    <td>${data.id}</td>
    <td>${data.name}</td>
    <td nowrap>
      <div class="sel-package-widget">
        <select class="sel-version-cat" name="">
          <option value="release" selected="true">release</option>
          <option value="snapshot">snapshot</option>
        </select>
        <select class="sel-version-val" name="">
        </select>
      </div>
      <div class="status">
        <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span> Loading ...
      </div>
    </td>
    <td>
      <div class="action">
        <button type="button" class="but-download-start btn btn-default btn-xs" title="start download">
          <span class="glyphicon glyphicon-play"  aria-hidden="true"></span>
        </button>
        <button type="button" disabled class="but-download-cancel btn btn-default btn-xs" title="cancel download">
          <span class="glyphicon glyphicon-stop" aria-hidden="true"></span>
        </button>
      </div>
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
    </td>
  </tr>
  `;
}

function createHTMLTable(moduleRef) {
  let HTMLTableBody = '';
  Object.keys(moduleRef).forEach(function(key,index) {
      // key: the name of the object key
      // index: the ordinal position of the key within the object
      HTMLTableBody += createHTMLModuleRow(key, moduleRef[key]);
  });
  return HTMLTableBody;
}

// in order to not create one event handler per row, delegate event handle to the
// tbody element.
$('tbody').on('click',function(ev){

  let $target    = $(ev.target);            // the HTML element clicked
  let row        = $target.closest('tr');   // the TR wrapper (row)
  let moduleId   = row.prop('id');          // the module Id
  let modVersion = row.data('version');     // module version data (or null)

  console.log(moduleId);
  //////////////////////////////////////////////////////////////////////////////
  if( $target.closest('.but-download-cancel').length > 0 ) {
    // usser cancel the current download (in progress)
    console.log('but-download-cancel');
    let $button = $target.closest('.but-download-cancel').first();

    // update UI
    row.find('.download-progress').hide();
    row.find('.progress-percent .percent-value').text("");
    row.find('.progress-percent .downloaded-filename').text("");
    $button.prop('disabled', true);
    row.find('.but-download-start').prop('disabled', false);

    ipcRenderer.send('nx-download-mod.cancel',{ moduleId : moduleId });

  } else  //////////////////////////////////////////////////////////////////////
    if( $target.closest('.chk-module').length > 0 ) {
    // User is asking to load version info for this module
    // if version info has not already been retreieved, fetch it now
    //
    console.log('chk-module');
    let $checkbox = $target.closest('.chk-module').first();
    if( $checkbox.prop('checked') ) {
      if( ! modVersion ) {
        // get module version data
        console.log("downloading version data for module "+moduleId);
        row.removeClass().addClass('loading-version');
        ipcRenderer.send('nx-fetch-version.start', row.data('ref'));
      }
    }

  } else ///////////////////////////////////////////////////////////////////////
    if( $target.closest('.but-download-start').length > 0 ) {
      // user starts the download of this module and for the selected version number
      // and category ('release' or 'snapshot')
      console.log('.but-download-start');

      // update UI
      row.find('.download-progress').show();
      $target.closest('.but-download-start').first().prop('disabled', true);
      row.find('.but-download-cancel').prop('disabled', false);
      row.find('.sel-version-val').first().prop('disabled',true);
      row.find('.sel-version-cat').first().prop('disabled',true);

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
  }
});

// handle dependent select box : release/snapshot - version
$('tbody').on('change',function(ev){

  let $target = $(ev.target);
  let row = $target.closest('tr');
  let moduleId = row.prop('id');
  console.log(moduleId);

  if( $target.closest('.sel-version-cat').length > 0 ) {
    console.log('.sel-version-cat');
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

//////////////////////////////////////////////////////////////////
// Custom Event handlers
//

// starts the creation of the module list
ipcRenderer.send('nx-load-module-ref.start');

// creates the HTML and add it inside tbody.
// data is the module-ref object
ipcRenderer.on('nx-load-module-ref.done',function(sender, data){
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
});

ipcRenderer.on('nx-load-module-ref.error',function(sender, error){
  console.error(error);
});

// update GUI on download progress for a specific module
ipcRenderer.on('nx-download-mod.progress', function(sender, data){
    console.log(data);
    let row     = $('#'+data.moduleId);
    let percent = Math.round(data.progress.percent * 100);

    // update UI
    row.find('.progress-percent .percent-value').first().text(percent + "%");
    row.find('.progress-percent .downloaded-filename').text("filename.war");
});

ipcRenderer.on('nx-download-mod.done',function(sender, data){
  console.log(data);
  let row     = $('#'+data.moduleId);

  // update UI
  row.find('.progress-percent .percent-value').first().text("100%");
  row.find('.progress-bar').first().css('width',"100%");
  row.find('.but-download-cancel').prop('disabled', true)
  row.find('.but-download-start').prop('disabled', false);
  row.find('.sel-version-val').first().prop('disabled',false);
  row.find('.sel-version-cat').first().prop('disabled',false);
});


ipcRenderer.on('nx-fetch-version.done',function(event,module){
  let row = $('#'+module.id);
  row.data('version',module.version);

  // update UI
  row.find('.sel-version-cat').trigger('change');
  row.removeClass().addClass('loaded');
});
