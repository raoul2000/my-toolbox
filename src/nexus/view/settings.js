const {dialog} = require('electron').remote
const config = require('../../config').config;

//console.log(config);
//console.log(config.get('nexus'));
//console.log(config.get('nexus.downloadFolder'));

// initialize setting forms with configured values
$('#nx-input-download-folder').val(
  config.get('nexus.downloadFolder')
);

// user chooses download folder using the default dialog
$('#nx-but-choose-folder').on('click',function(ev){
  let folder = dialog.showOpenDialog({
    title : "Download folder",
    properties: [ 'openDirectory']});
  $('#nx-input-download-folder').val(folder);
});

// user save settings : validation is required
$('#nx-but-save-settings').on('click',function(){
  let downloadFolder = document.forms["nx-form-settings"]["nx-input-download-folder"].value.trim();
  if( downloadFolder === '') {
    alert('A download folder  is required');
  } else {
    config.set('nexus.downloadFolder', downloadFolder);
  }
  console.log(downloadFolder);
});
