"use strict";
const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('nx-download-mod.progress', function(sender, progress){
    console.log(progress);
});

$('.but-download').on('click',function(el){
  let $button = $(this);
  let row = $button.closest('tr');
  let modId = row.prop('id');
  let modVersion = row.data('version');

  console.log(modVersion);

  let selVersion = row.find('.sel-version-val > option:selected').prop('value');
  let selCat     = row.find('.sel-version-cat > option:selected').prop('value');
  let arg = {
    moduleId : modId,
    version : selVersion,
    cat : selCat
  };
  console.log(arg);
  ipcRenderer.send('nx-download-mod.start',arg);
});

ipcRenderer.on('nx-fetch-version.done',function(event,data){
  let row = $('#'+data.moduleId);
  row.data('version',data.version);
  row.find('.sel-version-cat').trigger('change');
  row.removeClass().addClass('loaded');
});

$('.chk-module').on('click',function(el){
  let $checkbox = $(this);
  if( $checkbox.prop('checked') ) {
    let row = $checkbox.closest('tr');
    let modVersion = row.data('version');
    if( ! modVersion ) {
      let id = row.prop('id');
      console.log("module id : "+id);
      // get module version data
      console.log("downloading version data for module "+id);
      row.removeClass().addClass('loading-version');

      ipcRenderer.send('nx-fetch-version.start',{ moduleId : id});
    }
  } else {

  }
});


$('.sel-version-cat').on('change',function(el){
  console.log('changing');
  let $selCat = $(this);
  let row =$selCat.closest('tr');
  let $selVersion = row.find('.sel-version-val');
  let selectedOption = $selCat.find('option:selected').prop('value');

  // clean and then populate version select list
  $selVersion.children('option').remove();
  row.data('version')[selectedOption].forEach(function(optValue){
    $selVersion.append($("<option></option>")
     .attr("value",optValue)
     .text(optValue));
  });
});
