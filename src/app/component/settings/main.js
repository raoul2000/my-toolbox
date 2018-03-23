var remote  = require('electron').remote;
var config  = require('../../service/config');
const store = require('../../service/store/store');
const app   = require('electron').remote.app;

module.exports = {
  data : function(){
    return {
      deployFolderPath       : '',
      ctdbFolderPath         : '',
      webappCatalogFilePath  : '',
      commandLibraryFilePath : '',
      puttyFilePath          : '',
      winscpFilePath         : '',
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
        debugger;
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
    selectPuttyFilePath : function() {
      var self = this;
      this.selectSingleFolder({
        "title"       : "Select the putty.exe file",
        "defaultPath" : app.getPath('documents'),
        "properties"  : [ 'openFile ']
      }, value => self.puttyFilePath=value );
    },
    selectWinscpFilePath : function() {
      var self = this;
      this.selectSingleFolder({
        "title"       : "Select the winscp.exe file",
        "defaultPath" : app.getPath('documents'),
        "properties"  : [ 'openFile ']
      }, value => self.winscpFilePath=value );
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
      config.store.set('ctdbFolderPath',this.ctdbFolderPath);
      config.store.set('deployFolderPath',this.deployFolderPath);
      config.store.set('webappCatalogFilePath',this.webappCatalogFilePath);
      config.store.set('puttyFilePath',this.puttyFilePath);
      config.store.set('winscpFilePath',this.winscpFilePath);
      config.store.set('persistentDesktop',this.persistentDesktop);
      config.store.set('desktopGroupByCategory',this.desktopGroupByCategory);
      config.store.set('expandTomcatView',this.expandTomcatView);
      config.store.set('expandWebappView',this.expandWebappView);
      config.store.set('commandLibraryFilePath',this.commandLibraryFilePath);
      config.store.set('checkSavePwdToSession',this.checkSavePwdToSession);

      if( ! this.persistentDesktop ) {
        config.clearDesktop();
      }
      this.goBack();
    }
  },
  mounted : function() {
    this.deployFolderPath       = config.store.get('deployFolderPath');
    this.ctdbFolderPath         = config.store.get('ctdbFolderPath');
    this.webappCatalogFilePath  = config.store.get('webappCatalogFilePath');
    this.puttyFilePath          = config.store.get('puttyFilePath');
    this.winscpFilePath         = config.store.get('winscpFilePath');
    this.persistentDesktop      = config.store.get('persistentDesktop');
    this.desktopGroupByCategory = config.store.get('desktopGroupByCategory');

    this.expandTomcatView       = config.store.get('expandTomcatView');
    this.expandWebappView       = config.store.get('expandWebappView');
    this.commandLibraryFilePath = config.store.get('commandLibraryFilePath');
    this.checkSavePwdToSession  = config.store.get('checkSavePwdToSession');

    Mousetrap.bind('esc', this.goBack, 'keyup');
  }
};
