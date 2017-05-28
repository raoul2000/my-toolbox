"use strict";
const ipcRenderer = require('electron').ipcRenderer;

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
    row.find('.progress-percent').text("");
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
        ipcRenderer.send('nx-fetch-version.start',{ moduleId : moduleId});
      }
    }

  } else ///////////////////////////////////////////////////////////////////////
    if( $target.closest('.but-download-start').length > 0 ) {
      // user starts the download of this module and for the selected version
      console.log('.but-download-start');
      let $button = $target.closest('.but-download-start').first();

      // update UI
      row.find('.download-progress').show();
      $button.prop('disabled', true);
      row.find('.but-download-cancel').prop('disabled', false);
      row.find('.sel-version-val').first().prop('disabled',true);
      row.find('.sel-version-cat').first().prop('disabled',true);
      console.log(modVersion);

      let selVersion = row.find('.sel-version-val > option:selected').prop('value');
      let selCat     = row.find('.sel-version-cat > option:selected').prop('value');
      let arg = {
        moduleId : moduleId,
        version : selVersion,
        cat : selCat
      };
      console.log(arg);
      ipcRenderer.send('nx-download-mod.start',arg);
  }
});

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
ipcRenderer.on('nx-download-mod.progress', function(sender, data){
    console.log(data);
    let row     = $('#'+data.moduleId);
    let percent = Math.round(data.progress.percent * 100);

    row.find('.progress-percent').first().text(percent + "%");
    row.find('.progress-bar').first().css('width',percent+"%");

});

ipcRenderer.on('nx-download-mod.done',function(sender, data){
  console.log(data);
  let row     = $('#'+data.moduleId);

  row.find('.progress-percent').first().text("100%");
  row.find('.progress-bar').first().css('width',"100%");
  row.find('.but-download-cancel').prop('disabled', true)
  row.find('.but-download-start').prop('disabled', false);
  row.find('.sel-version-val').first().prop('disabled',false);
  row.find('.sel-version-cat').first().prop('disabled',false);


});

ipcRenderer.on('nx-fetch-version.done',function(event,data){
  let row = $('#'+data.moduleId);
  row.data('version',data.version);
  row.find('.sel-version-cat').trigger('change');
  row.removeClass().addClass('loaded');
});
