const {dialog} = require('electron').remote
const config = require('../../config').config;
const userConfig = require('../../config').userConfig;
const defaultConfig = require('../../config').defaultConfig;
const fs = require('fs');


// initialize setting forms with configured values
function loadSettingsForm() {

  $('#nexus-settings *[data-cfg-key]').each(function(el){
    
    let $el = $(this);
    let cfgKey = $el.data('cfg-key');
    $el.prop('placeholder', "Default : " + defaultConfig.get(cfgKey));
    if( userConfig.has(cfgKey)) {
      $el.val(userConfig.get(cfgKey))
    }
  });
}
loadSettingsForm();


// user chooses download folder using the default dialog
$('#nx-but-choose-folder').on('click',function(ev){
  let folder = dialog.showOpenDialog({
    title : "Download folder",
    properties: [ 'openDirectory']});
    console.log(folder);
  if( folder ) {
    let folderName = folder[0].trim();
    if( folderName !== '') {
      $('#nx-input-download-folder').val(folder[0].trim());
      $('#nx-input-download-folder').focus();
    }
  }
});

// validate and save the download folder value
$('#nx-input-download-folder').on('blur', function(ev){
  let $input = $(ev.target);
  let inputVal = $input.val().trim();
  if( inputVal === '') {
    $input.val('');
    userConfig.delete('nexus.downloadFolder');
  } else {
    console.log(inputVal);
    if ( ! fs.existsSync(inputVal)) {
        $input.attr('data-original-title','folder not found');
        $input.tooltip('show');
        setTimeout(function(){
          $input.tooltip('hide');
        },2000);
        $input.val('');
        userConfig.delete('nexus.downloadFolder');
    } else {
      userConfig.set('nexus.downloadFolder', inputVal);
    }
  }
});

// user chooses config folder using the default dialog
$('#nx-but-choose-conf-folder').on('click',function(ev){
  let folder = dialog.showOpenDialog({
    title : "Configuration folder",
    properties: [ 'openDirectory']});
  if( folder ) {
    let folderName = folder[0].trim();
    if( folderName !== '') {
      $('#nx-input-conf-folder').val(folder[0].trim());
      $('#nx-input-conf-folder').focus();
    }
  }
});

// validate and save the config folder value
$('#nx-input-conf-folder').on('blur', function(ev){
  let $input = $(ev.target);
  let inputVal = $input.val().trim();
  if( inputVal === '') {
    $input.val('');
    userConfig.delete('nexus.confFolder');
  } else {

    if ( ! fs.existsSync(inputVal)) {
      $input.attr('data-original-title','folder not found');
      $input.tooltip('show');
      setTimeout(function(){
        $input.tooltip('hide');
      },2000);
      $input.val('');
      userConfig.delete('nexus.confFolder');
    } else {
      userConfig.set('nexus.confFolder', inputVal);
    }
  }
});
