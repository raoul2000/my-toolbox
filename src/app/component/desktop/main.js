var remote     = require('electron').remote;
var fs         = require('fs');
const store    = require('../../service/store/store');
const notify   = require('../../service/notification');
const config   = require('../../service/config');

/**
 * The Desktop view allows the user to load one more items from the ctdb folder path into the main view
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
    /**
     * Opens a view for a specific item.
     *
     * @param  {inetger} index indes of the item in the current store
     */
    view : function(index) {
      this.$router.push({ path: '/view', query: { "index": index }});
    },
    /**
     * Remove an item from the desktopn
     * @param  {integer} index the item index in the current store
     */
    removeFromDesktop : function(index) {
      store.commit('removeFromDesktop',index);
    },
    /**
     * Opens a file selection dialog box (native) so the user can select one or more
     * item that will be added to the desktopn.
     */
    openDesktopItems : function() {
      var self = this;
      var baseFolder = config.get('ctdbFolderPath');
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select Item",
          "defaultPath" : baseFolder,
          "properties" : [ 'openFile', 'multiSelections']
        },
        function(filenames) {
          console.log(filenames);
          if( Array.isArray(filenames) ) {
            filenames.forEach(file => {
              if( store.getters.desktopItemByFilename(file) !== undefined) {
                notify('The item is already included in the desktop','warning','warning');
              } else {
                console.log(file.replace(baseFolder,''));
                var relativeFilePath = file.replace(baseFolder,'');
                if(relativeFilePath === file) {
                  // TODO : wee how to highlight the existing item (css animate ?)
                  notify('It is not permitted to select an item out of the base folder','error','Error');
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
  }
};
