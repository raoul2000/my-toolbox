var remote     = require('electron').remote;
var fs         = require('fs');
var path       = require('path');
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
    itemPath : function(item) {
      return path.dirname(item.filename).split(path.delimiter).join(' - ');
    },
    createItem : function() {
      this.$router.push('/create');
    },
    /**
     * Opens a view for a specific item.
     *
     * @param  {inetger} index indes of the item in the current store
     */
    viewDetail : function(index, event) {
      console.log(event);

      if(event.target.closest(".btn") === null) {
        this.$router.push({ path: `/item-view/${index}/settings`});
        event.stopPropagation();
      }
      //this.$router.push({ path: '/item-view', query: { "index": index }});
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

      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select Item",
          "defaultPath" : config.getCTDBPath(),
          "properties" : [ 'openFile', 'multiSelections']
        },
        function(filenames) {
          let ctdbBasePath = config.store.get("ctdbFolderPath");
          if( Array.isArray(filenames) ) {
            filenames.forEach(file => {
              console.log("duplisatce");
              // check if this file is under the CTBD base folder
              var relativeFilePath = file.replace(ctdbBasePath,'');
              if(relativeFilePath === file) {
                // TODO : wee how to highlight the existing item (css animate ?)
                notify('It is not permitted to select an item out of the base folder','error','Error');
              } else if( store.getters.desktopItemByFilename(relativeFilePath) !== undefined) {
                notify(`The item is already included in the desktop : <b>${relativeFilePath}</b>`,'warning','warning');
              } else {
                store.commit('addToDesktop',{
                  "filename" : relativeFilePath,
                  "data"     : JSON.parse(fs.readFileSync(file, 'utf8'))
                });
                config.store.set('recent.ctdbPath',path.dirname(file));
              }
            });
          }
        }
      );
    }
  }
};
