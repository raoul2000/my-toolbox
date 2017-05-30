const {dialog} = require('electron').remote
const config = require('../../config').config;
const defaultConfig = require('../../config').defaultConfig;

//console.log(config);
//console.log(config.get('nexus'));
//console.log(config.get('nexus.downloadFolder'));

// initialize setting forms with configured values
function loadSettingsForm() {

  $('#nexus-settings *[data-cfg-key]').each(function(el){
    let $el = $(this);
    let cfgKey = $el.data('cfg-key');
    $el.prop('placeholder', "Default : " + config.get(cfgKey+'.def'));
    console.log(cfgKey);
  });

  // downloadFolder
  console.log("load settings");
  if(config.get('nexus.downloadFolder.val')) {
    $('#nx-input-download-folder').val(
      config.get('nexus.downloadFolder.val')
    );
  }
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
    config.set('nexus.downloadFolder.val', null);
  } else {
    config.set('nexus.downloadFolder.val', inputVal);
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
    config.set('nexus.confFolder.val', null);
  } else {
    config.set('nexus.confFolder.val', inputVal);
  }
});


// TODO : implement config folder
//

// user save settings : validation is required
$('#nx-but-save-settings').on('click',function(){
  let downloadFolder = document.forms["nx-form-settings"]["nx-input-download-folder"].value.trim();
  if( downloadFolder === '') {
    alert('A download folder  is required');
  } else {
    config.set('nexus.downloadFolder.val', downloadFolder);
  }
  console.log(downloadFolder);
});
