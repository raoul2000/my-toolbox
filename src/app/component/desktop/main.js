var remote     = require('electron').remote;
var fs         = require('fs');
const store    = require('../../service/store/store');
const notify   = require('../../service/notification');
const config   = require('../../service/config');

/**
 * The Desktop view allows the user to load one more items from the dataFolder into the main view
 * From there, the user can perform actions on desktop items.
 */
module.exports = {
  template: require('./main.html'),
  computed : {
    items : function(){
      return store.state.desktop;
    }
  },
  methods : {
    createItem : function() {
      this.$router.push('/create');
    },
    view : function(index) {
      this.$router.push({ path: '/view', query: { "index": index }});
    },
    removeFromDesktop : function(index) {
      store.commit('removeFromDesktop',index);
    },
    openDesktopItems : function() {
      var self = this;
      var baseFolder = config.get('dataFolder');
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select Item",
          "properties" : [ 'openFile', 'multiSelections']
        },
        function(filenames) {
          console.log(filenames);
          if( Array.isArray(filenames) ) {
            filenames.forEach(file => {
              // TODO : only add o desktop if not already there - existing item
              // could by highlighted by CSS (flash ?)
              if( store.getters.desktopItemByFilename(file) !== undefined) {
                notify('The item is already included in the desktop','warning','warning');
              } else {
                console.log(file.replace(baseFolder,''));
                var relativeFilePath = file.replace(baseFolder,'');
                if(relativeFilePath === file) {
                  notify('It is not permitted to select an item out of the data folder','error','Error');
                } else {
                  store.commit('addToDesktop',{
                    "filename" : relativeFilePath,
                    "data" : JSON.parse(fs.readFileSync(file, 'utf8'))
                  });
                }
              }
            });
          }
        }
      );
    }
  },
  // life cycle hook ///////////////////////////////////////////////////////////
  mounted : function(){
    //this.loadOptionsFromUrl();
  }
};
