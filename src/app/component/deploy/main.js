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
        "deployFolder" : ""
      };
    },
  template: require('./main.html'),
  computed: {
    modules () {
      return store.state.modules;
    }
  },
  methods : {
    startDeploySSH : function() {
      console.log('startDeploySSH');
      if( store.state.modules.findIndex( module => module.selected) === -1) {
        notify('No module selected','warning', 'warning');
      } else {
        $('#modal-deploy-ssh').modal("show").one('hidden.bs.modal', function (e) {

        });
      }
    },
    refresh : function() {
      artefact
        .buildListFromLocalFolder(this.deployFolder)
        .then( moduleList => {
          moduleList.forEach(item => item.action = "idle" );
          store.commit("updateModuleList",moduleList);
        });
    },
    showFolderInExplorer : function() {
      electron.shell.openItem(this.deployFolder);
    },
    deleteSelectedModules : function() {
      let modulesToDelete = this.modules.filter( item => item.selected);
      console.log(modulesToDelete);
      if(modulesToDelete.length === 0 ) {
        notify('No file selected','warning', 'warning');
      } else {
        let deployFolder = this.deployFolder;
        let self = this;
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
              store.commit("deleteModule",module);
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
