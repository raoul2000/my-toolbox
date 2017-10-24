var electron   = require('electron');
var remote     = require('electron').remote;
var fs         = require('fs');
var path         = require('path');
const store    = require('../../service/store/store');
const config   = require('../../service/config');
const moduleModel   = require('./lib/module');
const deploySSH   = require('./lib/deploy-ssh');
const deployEvent   = require('./deploy-event');
const promiseUtils   = require('../../lib/promise-utils');


Vue.component('module-row', require('./module-row/main'));

module.exports = {
  data : function(){
    return {
        "deployFolder" : "",
        "ssh" :
          {
            'host'     : "192.168.203.182",
            'port'     : 22,
            'username' : "meth01",
            'password' : "meth01"
          },
          "targetPath" : "/methode/meth01/tmp"
      };
    },
  template: require('./main.html'),
  computed: {
    modules () {
      return store.state.modules;
    }
  },
  methods : {
    enterSSHSettings : function() {
      console.log('enterSSHSettings');
      let modulesToDeploy = store.state.modules.filter(
        module => module.selected === true
        && module.busy === false
      );
      if( modulesToDeploy.length === 0 ) {
        notify('No module selected, or selected module not ready','warning', 'warning');
      } else {
        $('#modal-deploy-ssh').modal("show");
      }
    },
    /**
     * [description]
     * @return {[type]} [description]
     */
    startDeploySSH : function() {
      console.log("startDeploySSH");
      $('#modal-deploy-ssh').modal("hide");
      let self = this;

      let tasks = store.state.modules.filter(
        module => module.selected === true
        && module.busy === false
      ).map( module => {
        return {
          "module" : module,
          "notifier" : deployEvent.createDeploymentObserver(module),
          "ssh" : self.ssh,
          "srcFilepath" : path.posix.join(self.deployFolder,module.dataFilename),
          "destFilepath" : path.posix.join(self.targetPath, module.metadata.installFolder, module.dataFilename),
          "symlinkPath" : path.posix.join(self.targetPath, module.metadata.symlink),
          "script" : {
            "srcFilepath"  : path.join(__dirname,"script",'type-1.bash'),
            "destFilepath" : path.posix.join(self.targetPath, module.metadata.installFolder, 'type-1.bash'),
            "arg" : [
              self.targetPath,
              module.metadata.installFolder,
              module.dataFilename,
              module.metadata.symlink
            ]
          }
        };
      });
      console.log(tasks);

      promiseUtils.parallel(tasks,deploySSH.run)
      .then( result => {
        console.log(result);
      });
    },
    /**
     * [description]
     * @return {[type]} [description]
     */
    refresh : function() {
      moduleModel
        .buildListFromLocalFolder(this.deployFolder)
        .then( moduleList => {
          let extendedModuleList = moduleList.map( module => {
            return {
              "dataFilename" : module.dataFilename,
              "metaFilename" : module.metaFilename,
              "metadata"     : module.metadata,
              // extra properties
              "selected"     : false,
              "status"       : "idle",
              "step"         : null,
              "progress"     : -1,
              "busy"         : false
            };
          });
          store.commit("updateModuleList",extendedModuleList);
        });
    },
    showFolderInExplorer : function() {
      electron.shell.openItem(this.deployFolder);
    },
    deleteSelectedModules : function() {
      let modulesToDelete = this.modules.filter(
        module => module.selected === true
        && module.busy === false
      );
      console.log(modulesToDelete);
      if(modulesToDelete.length === 0 ) {
        notify('No module selected or selected module not ready','warning', 'warning');
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
