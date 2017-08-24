var remote = require('electron').remote;
var config = require('../../service/config');
const store    = require('../../service/store/store');

module.exports = {
  data : function(){
    return {
      dataFolder : ''
    };
  },
  template: require('./main.html'),
  methods : {
    onCancel : function() {
      this.$router.push(store.state.currentRoute);
    },
    selectDataFolder : function() {
      var self = this;
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select the Data folder",
          "properties" : [ 'openDirectory']
        },
        function(folders) {
          console.log(folders);
          if( Array.isArray(folders) ) {
            self.dataFolder = folders[0];
          }
        }
      );
    },
    onSave : function() {
      // TODO : validate data Folder
      config.set('dataFolder',this.dataFolder);

      // navigate to preview route (go back)
      this.$router.push(store.state.currentRoute);

    }
  },
  mounted : function() {
    // TODO : set a default value ?
    this.dataFolder = config.get('dataFolder');
  }
};
