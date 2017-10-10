var electron   = require('electron');
var remote     = require('electron').remote;
var fs         = require('fs');
const store    = require('../../service/store/store');
const config   = require('../../service/config');
const artefact = require('./lib/artefact');

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
    removeModuleByDataFilename: function (dataFilename) {
      for (var i = 0; i < this.modules.length; i++) {
        if(this.modules[i].dataFilename === dataFilename){
          this.modules.splice(i, 1);
          break;
        }
      }
    },
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
      let deployFolder = this.deployFolder;
      let self = this;
      console.log(modulesToDelete);
      if(modulesToDelete.length === 0 ) {
        notify('No file selected','warning', 'warning');
      } else {
        (new PNotify({
            title: 'Confirmation Needed',
            text: `Are you sure you want to delete ${modulesToDelete.length} modules ?`,
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
            console.log("deleting",modulesToDelete );
            modulesToDelete.forEach(module => {
              // TODO : call fs.unlinkSync() sur data and meta filename
              self.removeModuleByDataFilename(module.dataFilename);
            });
        });
      }
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
