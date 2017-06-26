$(document).ready(function(){
    $('[data-toggle="tooltip-validation"]').tooltip({trigger: 'manual'});
    //$('[data-toggle="tooltip"]').tooltip({container: 'body'});
});

/**
 * Returns dataset associated with each selected file.
 *
 * @return {[object]} dataset array
 */
function getSelectedFiles() {
  let resultSet = [];
  document.querySelectorAll('#nexus-deploy-mod input.chk-module')
  .forEach(item => {
    if(item.checked) {
      resultSet.push(item.parentNode.parentNode.dataset);
    }
  });
  return resultSet;
}

/**
 * Checks that the deployment can occur depending on file list state
 *
 * @return {boolean} TRUE if deployement can take place, FALSE if not
 */
function validateDeploy() {

  let isValid = false;
  if(document.querySelector('tr.editing') ) {
    notify('Modifications in progress : validate or cancel before deploying ', 'warning', 'Modification in progress');
  } else {
    // check selected files are ok
    let selectedFiles = getSelectedFiles();
    console.log(selectedFiles);
    if( selectedFiles.length === 0) {
      notify('Select at least one file to deploy', 'warning', 'No file selected');
    } else {
      // let's validate that each file as required info
      let invalidFile = selectedFiles.find( (file) => {
        return Object.keys(file).find( key => {
          return file[key].length === 0 || file[key] === 'null';
        });
      });
      if( invalidFile) {
        notify("One or more selected files have undefined information","error","Invalid File(s) Info");
      } else {
        isValid = true;
      }
    }
  }
  return isValid;
}
