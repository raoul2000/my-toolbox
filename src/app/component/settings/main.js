var remote = require('electron').remote;
var config = require('../../service/config');
const store    = require('../../service/store/store');

module.exports = {
  data : function(){
    return {
      dataFolder : '',
      deployFolder : ''
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
    selectDeployFolder : function() {
      var self = this;
      this.selectSingleFolder({
        "title"      : "Select the Deploy folder",
        "properties" : [ 'openDirectory']
      }, value => self.deployFolder=value );
    },
    selectDataFolder : function() {
      var self = this;
      this.selectSingleFolder({
        "title"      : "Select the Data folder",
        "properties" : [ 'openDirectory']
      }, value => self.dataFolder=value );
    },

    onCancel : function() {
      this.$router.go(-1);
    },
    onSave : function() {
      // TODO : validate Folder
      config.set('dataFolder',this.dataFolder);
      config.set('deployFolder',this.deployFolder);

      // navigate to preview route (go back)
      this.$router.push(store.state.currentRoute);
      this.$router.go(-1);
    }
  },
  mounted : function() {
    // TODO : set a default value ?
    this.dataFolder = config.get('dataFolder');
    this.deployFolder = config.get('deployFolder');
  }
};
