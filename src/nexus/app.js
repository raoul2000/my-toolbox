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
