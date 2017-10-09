var electron = require('electron');
var remote = require('electron').remote;
var fs = require('fs');
const store    = require('../../service/store/store');
const config   = require('../../service/config');
const artefact   = require('./lib/artefact');

Vue.component('module-row', require('./module-row/main'));

module.exports = {
  data : function(){
    return {
        "deployFolder" : "",
        "modules" : []
      };
    },
  template: require('./main.html'),
  methods : {
    refresh : function() {
      console.log('click REFRESH');
      artefact
        .buildListFromLocalFolder(this.deployFolder)
        .then( moduleList => this.modules = moduleList );
    },
    showFolderInExplorer : function() {
      electron.shell.openItem(this.deployFolder);
    },
    deleteSelectedModules : function() {
      let modulesToDelete = this.modules.filter( item => item.selected);
      console.log(modulesToDelete);
      if(modulesToDelete.length == 0 ) {
        notify('No file selected','warning', 'warning');
      } else {
        (new PNotify({
            title: 'Confirmation Needed',
            text: 'Are you sure?',
            icon: 'glyphicon glyphicon-question-sign',
            hide: false,
            confirm: {
                confirm: true
            },
            buttons: {
                closer: false,
                sticker: false
            },
            history: {
                history: false
            },
            stack: {"dir1": "down", "dir2": "left", "modal": true, "overlay_close": true}
        })).get().on('pnotify.confirm', function() {
            alert('Ok, cool.');
        }).on('pnotify.cancel', function() {
            alert('Oh ok. Chicken, I see.');
        });
      }
      // TODO : delete data and metadata files
    }
  },
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
    this.refresh();

  }
};
