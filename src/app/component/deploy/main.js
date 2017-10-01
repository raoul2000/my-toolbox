var electron = require('electron');
var remote = require('electron').remote;
var fs = require('fs');
const store    = require('../../service/store/store');
const config   = require('../../service/config');
const artefact   = require('./lib/artefact');

module.exports = {
  data : function(){
    return {
        "deployFolder" : "",
        "modules" : []
      };
    },
  template: require('./main.html'),
  mounted : function(){
    var self = this;
    if(config.has('deployFolder') === false ) {
      notify('No deploy folder configured','error', 'error');
      return;
    }
    var deployFolder = config.get('deployFolder');
    if ( fs.existsSync(deployFolder) === false ) {
      notify(`Configured Deploy Folder Not Found : <b>${deployFolder}</b>`,'error', 'error');
      return;
    }
    console.log("deployFolder = ",deployFolder);
    this.deployFolder = deployFolder;

    artefact.buildListFromLocalFolder(deployFolder)
      .then( moduleList => this.modules = moduleList );
  }
};
