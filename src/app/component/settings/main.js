"use strict";

const remote   = require('electron').remote;
const service  = require('../../service/index');
const app      = require('electron').remote.app;

module.exports = {
  data : function(){
    return {
      deployFolderPath       : '',
      ctdbFolderPath         : '',
      webappCatalogFilePath  : '',
      commandLibraryFilePath : '',
      persistentDesktop      : true,
      desktopGroupByCategory : false,
      expandTomcatView       : false,
      expandWebappView       : false,
      themeName              : "",
      checkSavePwdToSession  : false
    };
  },
  template: require('./main.html'),
  watch : {
    themeName : function() {
      if( this.themeName) {
        console.log('theme : '+this.themeName);
      }
    }
  },
  methods : {
    /**
     * Generic single folder selection diialog box
     * @see https://github.com/electron/electron/blob/master/docs/api/dialog.md
     * @param  {oobject}   options dialog box option object
     * @param  {Function} cb      ivoked after user sslects one folder. prototype is cb(folderName)
     */
    selectSingleFolder : function(options,cb) {
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        options,
        function(folders) {
          console.log(folders);
          if( Array.isArray(folders) ) {
            cb(folders[0]);
          }
        }
      );
    },
    selectDeployFolderPath : function() {
      var self = this;
      this.selectSingleFolder({
        "title"       : "Select the Deploy folder",
        "defaultPath" : self.deployFolderPath,
        "properties"  : [ 'openDirectory']
      }, value => self.deployFolderPath=value );
    },

    selectCTDBFolderPath : function() {
      var self = this;
      this.selectSingleFolder({
        "title"       : "Select the CTDB base Folder",
        "defaultPath" : self.ctdbFolderPath,
        "properties"  : [ 'openDirectory']
      }, value => self.ctdbFolderPath=value );
    },

    selectWebappCatalogFilePath : function() {
      var self = this;
      this.selectSingleFolder({
        "title"       : "Select the Web App Catalog file",
        "defaultPath" : self.webappCatalogFilePath,
        "properties"  : [ 'openFile']
      }, value => self.webappCatalogFilePath=value );
    },

    selectCommandLibraryFilePath : function() {
      var self = this;
      this.selectSingleFolder({
        "title"       : "Select the Command Library file",
        "defaultPath" : self.commandLibraryFilePath,
        "properties"  : [ 'openFile']
      }, value => self.commandLibraryFilePath=value );
    },
    goBack : function() {
      Mousetrap.unbind('esc', 'keyup');
      this.$router.go(-1);
    },
    onCancel : function() {
      this.goBack();
    },
    onSave : function() {
      // TODO : validate Folder
      let cfgStore = service.config.store; // shorcut

      // if the DB folder was changed we must reset the items in the desktop and the 
      //recent CTDB path values
      if( this.ctdbFolderPath !== cfgStore.get('deployFolderPath')) {
        service.config.clearDesktop();
        service.store.commit('removeAllItems');
        service.config.clearRecentCTDBPath();
        cfgStore.set('ctdbFolderPath',this.ctdbFolderPath);
      }

      cfgStore.set('deployFolderPath',this.deployFolderPath);
      cfgStore.set('webappCatalogFilePath',this.webappCatalogFilePath);

      cfgStore.set('persistentDesktop',this.persistentDesktop);
      if( ! this.persistentDesktop ) {
        service.config.clearDesktop();
      }

      cfgStore.set('desktopGroupByCategory',this.desktopGroupByCategory);
      cfgStore.set('expandTomcatView',this.expandTomcatView);
      cfgStore.set('expandWebappView',this.expandWebappView);
      cfgStore.set('commandLibraryFilePath',this.commandLibraryFilePath);
      cfgStore.set('checkSavePwdToSession',this.checkSavePwdToSession);

      this.goBack();
    }
  },
  mounted : function() {
    let cfgStore = service.config.store; // shorcut

    this.deployFolderPath       = cfgStore.get('deployFolderPath');
    this.ctdbFolderPath         = cfgStore.get('ctdbFolderPath');
    this.webappCatalogFilePath  = cfgStore.get('webappCatalogFilePath');
    this.persistentDesktop      = cfgStore.get('persistentDesktop');
    this.desktopGroupByCategory = cfgStore.get('desktopGroupByCategory');

    this.expandTomcatView       = cfgStore.get('expandTomcatView');
    this.expandWebappView       = cfgStore.get('expandWebappView');
    this.commandLibraryFilePath = cfgStore.get('commandLibraryFilePath');
    this.checkSavePwdToSession  = cfgStore.get('checkSavePwdToSession');

    Mousetrap.bind('esc', this.goBack, 'keyup');
  }
};
