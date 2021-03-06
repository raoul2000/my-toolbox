var electron   = require('electron');
var remote     = require('electron').remote;
var fs         = require('fs');
var path         = require('path');
const store    = require('../../service/store/store');
const service  = require('../../service/index');
const config   = require('../../service/config');
const moduleModel   = require('./lib/module');
const deploySSH   = require('./lib/deploy-ssh');
const deployEvent   = require('./deploy-event');
const promiseUtils   = require('../../lib/promise-utils');


Vue.component('deploy-row', require('./deploy-row/main'));

module.exports = {
  data : function(){
    return {
        "deployFolderPath" : "",
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
      let modulesToDeploy = store.state.modules.filter(
        module => module.selected === true
        && module.busy === false
      );
      if( modulesToDeploy.length === 0 ) {
        service.notification.warning(
          'Warning', 'No module selected, or selected module not ready'
        );
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
          "module"       : module,
          "ssh"          : self.ssh,
          "notifier"     : deployEvent.createDeploymentObserver(module),
          "srcFilepath"  : path.posix.join(self.deployFolderPath,module.dataFilename),
          "destFilepath" : path.posix.join(self.targetPath, module.metadata.installFolder, module.dataFilename),
          "symlinkPath"  : path.posix.join(self.targetPath, module.metadata.symlink),
          "script"       : {
            "srcFilepath"  : path.join(__dirname,"script",'default.bash'),
            "destFilepath" : path.posix.join(self.targetPath, module.metadata.installFolder, 'default.bash'),
            "arg"          : [
              self.targetPath,
              module.metadata.installFolder,
              module.dataFilename,
              module.metadata.symlink
            ]
          }
        };
      });
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
        .buildListFromLocalFolder(this.deployFolderPath)
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
      electron.shell.openItem(this.deployFolderPath);
    },
    deleteSelectedModules : function() {
      let modulesToDelete = this.modules.filter(
        module => module.selected === true
        && module.busy === false
      );
      console.log(modulesToDelete);
      if(modulesToDelete.length === 0 ) {
        service.notification.warning(
          'Warning',
          'No module selected or selected module not ready'
        );
      } else {
        let deployFolderPath = this.deployFolderPath;
        let self = this;
        service.notification.confirm(
          'Confirmation Needed',
          `Are you sure you want to delete ${modulesToDelete.length} modules ?`
        )
        .on('confirm', ()=> {
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
    if(config.store.has('deployFolderPath') === false ) {
      service.notification.error(
        'Error', 'No deploy folder configured'
      );
      return;
    }
    var deployFolderPath = config.store.get('deployFolderPath');
    if ( fs.existsSync(deployFolderPath) === false ) {
      service.notification.error(
        'Error', `Configured Deploy Folder Not Found : <b>${deployFolderPath}</b>`
      );
      return;
    }
    console.log("deployFolderPath = ",deployFolderPath);
    this.deployFolderPath = deployFolderPath;
    this.refresh();
  }
};
