var remote = require('electron').remote;
var config = require('../../service/config');
const store    = require('../../service/store/store');

module.exports = {
  data : function(){
    return {
      deployFolderPath : '',
      ctdbFolderPath : '',
      webappCatalogFilePath : ''
    };
  },
  template: require('./main.html'),
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
        "title"      : "Select the Deploy folder",
        "defaultPath" : self.deployFolderPath,
        "properties" : [ 'openDirectory']
      }, value => self.deployFolderPath=value );
    },
    selectCTDBFolderPath : function() {
      var self = this;
      this.selectSingleFolder({
        "title"      : "Select the CTDB base Folder",
        "defaultPath" : self.ctdbFolderPath,
        "properties" : [ 'openDirectory']
      }, value => self.ctdbFolderPath=value );
    },

    selectWebappCatalogFilePath : function() {
      var self = this;
      this.selectSingleFolder({
        "title"      : "Select the Web App Catalog file",
        "defaultPath" : self.webappCatalogFilePath,
        "properties" : [ 'openFile']
      }, value => self.webappCatalogFilePath=value );
    },

    onCancel : function() {
      this.$router.go(-1);
    },
    onSave : function() {
      // TODO : validate Folder
      config.set('ctdbFolderPath',this.ctdbFolderPath);
      config.set('deployFolderPath',this.deployFolderPath);
      config.set('webappCatalogFilePath',this.webappCatalogFilePath);

      // navigate to preview route (go back)
      this.$router.push(store.state.currentRoute);
      this.$router.go(-1);
    }
  },
  mounted : function() {
    this.deployFolderPath = config.get('deployFolderPath');
    this.ctdbFolderPath = config.get('ctdbFolderPath');
    this.webappCatalogFilePath = config.get('webappCatalogFilePath');
  }
};
