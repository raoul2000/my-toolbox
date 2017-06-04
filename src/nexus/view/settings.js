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

/**
 * Display the choose folder dialog box on user demand and
 * save the selected value to input value control.
 *
 * @param  {string} inputElementId the input element id
 * @param  {string} dlgTitle       folder chooser dialog box title
 */
function chooseFolder(inputElementId, dlgTitle) {
  let folder = dialog.showOpenDialog({
    "title"      : dlgTitle,
    "properties" : [ 'openDirectory']});
    console.log(folder);
  if( folder ) {
    let folderName = folder[0].trim();
    if( folderName !== '') {
      let inputEl = document.getElementById(inputElementId);
      inputEl.value = folder[0].trim();
      inputEl.focus();
    }
  }
}

/**
 * Focus is leaving the input  control : validate it value
 * or display tool tip on error
 *
 * @param  {HTMLElement} input  the input control instance
 * @param  {string} cfgKey the configuration key
 * @param  {function} validator function alidator (returns TRUE/FALSE)
 */
function onTextInputBlur(input, cfgKey, validator) {
  let inputVal = input.value.trim();
  if( inputVal === '') {
    input.value = '';
    userConfig.delete(cfgKey);
  } else {
    console.log(inputVal);
    let validationError = validator(inputVal);
    if( validationError ) {
      let $input = $(input);
      $input.attr('data-original-title',validationError);
      $input.tooltip('show');
      setTimeout(function(){
        $input.tooltip('hide');
      },2000);
      $input.val('');
      userConfig.delete(cfgKey);
    } else {
      userConfig.set(cfgKey, inputVal);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////
// Validators
//
function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n > 0;
}
function folderExists(val) {
  return fs.existsSync(val);
}


////////////////////////////////////////////////////////////////////////////////
// event handlers
//
// user chooses download folder using the default dialog
$('#nx-but-choose-folder').on('click',function(ev){
  chooseFolder('nx-input-download-folder', 'Download Folder');
});

// validate and save the download folder value
$('#nx-input-download-folder').on('blur', function(ev){
  onTextInputBlur(ev.target, "nexus.downloadFolder",function(val){
    if( folderExists(val) === false ) {
      return "this folder doesn't exist";
    }
  });
});

// user chooses config folder using the default dialog
$('#nx-but-choose-conf-folder').on('click',function(ev){
  chooseFolder('nx-input-conf-folder', 'Configuration Folder');
});

// validate and save the config folder value
$('#nx-input-conf-folder').on('blur', function(ev){
  onTextInputBlur(ev.target, "nexus.confFolder",function(val){
    if( folderExists(val) === false ) {
      return "this folder doesn't exist";
    }
  });
});

$('#nx-request-timeout').on('blur', function(ev){
  onTextInputBlur(ev.target, "nexus.requestTimeout",function(val){
    if( isNormalInteger(val) === false ) {
      return "enter a positive integer value";
    }
  });
});
