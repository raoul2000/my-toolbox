var remote     = require('electron').remote;
var fs         = require('fs');
var path       = require('path');
const store    = require('../../service/store/store');
const helper   = require('../../lib/lib').helper;
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const service   = require('../../service/index');

/**
 * The Desktop view allows the user to load one more items from the ctdb folder path into the main view
 * From there, the user can perform actions on desktop items.
 */
module.exports = {
  store,
  data : function(){
    return {
      groupByCategory : service.config.store.get("desktopGroupByCategory"),
      items : store.state.desktop,
      isReadOnly : service.db.isReadOnly()
    };
  },
  template: require('./main.html'),
  computed : {
    topLevelCategories : function() {
      let keys = helper.groupBy(store.state.desktop, item => {
        if( item.path.length === 0) {
          return "NO CATEGORY";
        } else {
          return item.path[0];
        }
      }).keys();
      return Array.from(keys);
    },
    /**
     * Number of desktop items currently selected
     */
    selectedItemCount : function(){
      return this.items.filter( item => item.isSelected).length;
    }
  },
  methods : {
    /**
     * Ping the selected server(s)
     */
    ping : function() {
      this.items.filter( item => item.isSelected)
      .map( currentItem => {
        store.commit('updateDesktopItem', {
          id         : currentItem.data._id,
          selector   : 'desktop',
          updateWith : {
            inProgress : true,
            isAlive    : null,
            isAliveStatusMessage : null
          }
        });         
        service.ssh.checkConnection(currentItem.data.ssh)
        .then( success => {
          console.log(success);
          store.commit('updateDesktopItem', {
            id         : currentItem.data._id,
            selector   : 'desktop',
            updateWith : {
              inProgress : false,
              isAlive : true,
              isAliveStatusMessage : "server is alive"
            }
          });          
        })
        .catch(error => {
          console.log(error);
          store.commit('updateDesktopItem', {
            id         : currentItem.data._id,
            selector   : 'desktop',
            updateWith : {
              inProgress : false,
              isAlive : false,
              isAliveStatusMessage : error
            }
          });            
        });
      });
    },
    /**
     * Mark an item as selected or deselected depending on the **select** argument
     */
    selectItem : function(item, select) {
      store.commit('updateDesktopItem', {
        id         : item.data._id,
        selector   : 'desktop',
        updateWith : {
          isSelected : select ? true : false
        }
      });  
    },
    /**
     * Select/deselect all desktop items
     */
    selectAllItems : function(select) {
      this.items.forEach( item => {
        this.selectItem(item, select);
      }); 
    },
    /**
     * Mark a desktop item as selected/unselected depending on its current state
     */
    toggleItemSelection : function(item) {
      this.selectItem(item, ! item.isSelected);
    },    
    toggleShowTask : function() {
      ipcRenderer.send('toggle-task-view');
    },
    addItemToGroup : function(category) {
      this.openDesktopItems(category);
    },
    /**
     * Remove All items from the desktop and save the new desktop state (empty)
     * in the current service.config.
     */
    clearDesktop : function(){
      if( store.state.desktop.length === 0) {
        return;
      } else {
        let self = this;
        let selectedItems = this.items.filter( item => item.isSelected );
        if(selectedItems.length !== 0) {
          // delete only selected items
          service.notification.confirm(
            'Confirmation Needed',
            "Are you sure you want to remove the selected item(s) from your desktop ?"
          )
          .on('confirm', ()=> {
            selectedItems.forEach( item => {
              self.removeFromDesktop(item);
            })
          });
        } else {
          // delete all items
          service.notification.confirm(
            'Confirmation Needed',
            "Are you sure you want to clear your desktop ?"
          )
          .on('confirm', ()=> {
            self.$store.commit('removeAllItems');
            service.config.clearDesktop();
            self.selectedItems = [];
          });
        }
      }
    },
    itemsByCategory : function(category) {
      return store.state.desktop.filter( item => {
        if( item.path.length === 0 && category === "NO CATEGORY") {
          return true;
        } else {
          return item.path[0] === category;
        }
      });
    },
    /**
     * Create the HTML element id for an item
     * @param  {object} item the item data object
     * @return {string} the element id
     */
    getItemElementId : function(itemData) {
      return itemData._id;
    },
    /**
     * Creates and returns the HTML content of a card item
     */
    cardItemContent : function(item) {
      let title = item.path.length > 0 ? item.path[0] : "no name";
      let name = item.name;
      let extraInfo = item.path.length > 1 ? item.path.filter( (token, index) => index > 0).join(' - ') : "";

      let html =
      `<div class="card-title" title="${title}">
        <span class="label label-default">${title}</span>
      </div>
      <div class="card-name" title="${name}">${name}</div>`;

      if( extraInfo.length > 0) {
        html = html.concat(`<div class="card-extra">${extraInfo}</div>`);
      }
      if( item.data.ssh.host ) {
        html = html.concat(`<div class="card-extra">${item.data.ssh.username}@${item.data.ssh.host}</div>`);
      } else {
        html = html.concat(`<div class="card-extra"><span class="label label-danger">missing host</span></div>`);
      }
      return html;
    },
    cardItemColor : function(item) {
      return {
        borderRightColor : service.ui.getItemColor(item)
      };
    },
    /**
     * Saves an empty item to file
     */
    createItem : function(category) {
      let defaultPath = service.config.getRecentCTDBPath();
      if( category && typeof category === "string") {
        defaultPath = path.join(
          service.config.store.get("ctdbFolderPath"),
          category
        );
      }

      //this.$router.push('/create');
      let newItem = {
        "_id" : helper.generateUUID(),
        "notes"  : '',
        "ssh"    : {
          "host"         : '',
          "port"         : 22,
          "username"     : '',
          "password"     : '',
          "readyTimeout" : 50000
        },
        //"entities"   : [],
        "tomcats"    : [],
        "components" : [],
        "commands"   : [],
        "repo"       : {
          template : null
        },
        "vars"       : [] // name/value pair for environment variables and entities
      };

      var defaultFilename = path.join(
        defaultPath,
        "NO_NAME"
      );
      console.log('saving to ', defaultFilename);

      remote.dialog.showSaveDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Save New Item",
          "defaultPath" : defaultFilename
        },
        function(filename) {
          console.log(filename);
          if( filename ) {
            let ctdbBasePath = service.config.store.get("ctdbFolderPath");
            // check if this file is under the CTBD base folder
            var relativeFilePath = filename.replace(ctdbBasePath,'');
            if(relativeFilePath === filename) {
              // TODO : wee how to highlight the existing item (css animate ?)
              service.notification.error(
                "It is not permitted to save an item out of the base folder"
              );
              //notify('It is not permitted to save an item out of the base folder','error','Error');
            } else {
              fs.writeFile(filename, JSON.stringify(newItem, null, 2) , 'utf-8', (err) => {
                if(err) {
                  service.notification.error(
                    "Failed to save item"
                  );
                  console.error(err);
                } else {

                  store.commit('addToDesktop',{
                    "filename" : relativeFilePath,
                    "data"     : newItem,
                    "name"     : path.basename(relativeFilePath),
                    "path"     : path.dirname(relativeFilePath)
                                  .split(path.sep)
                                  .filter( token => token.length !== 0)
                  });
                  service.config.store.set('recent.ctdbPath',path.dirname(filename));
                  service.config.addDesktopItem(filename);
                  service.notification.success(
                    `Saved to <b>${relativeFilePath}</b> and added to your desktop`
                  );
                }
              });
            }
          }
        }
      );
    },
    /**
     * Toggle grouping desktop items by category.
     * The category is the first item of the path array (ie the root folder name)
     */
    toggleGroup : function(){
      this.groupByCategory = ! this.groupByCategory;
      service.config.store.set('desktopGroupByCategory', this.groupByCategory);
    },
    /**
     * Opens a view for a specific item.
     *
     * @param  {inetger} index index of the item in the current store
     */
    viewDetail : function(item, event) {
      if(event.target.closest(".btn") === null) { // make sure user clicked on the button
        if(event.ctrlKey) {
          this.toggleItemSelection(item);
        } else {
          // clear pending selection
          //this.selectedItems = [];
          // to push a route with a query param use :
          // this.$router.push({ path: '/item-view', query: { "id": item.data._id }})
          this.$router.push({ path: `/item-view/${item.data._id}/webapps`});
        }
        event.stopPropagation();
      }
    },
    /**
     * Remove all desktop items grouped in a category
     * @param  {[type]} category [description]
     * @return {[type]}          [description]
     */
    removeGroupFromDesktop : function(category) {
      let self = this;
      service.notification.confirm(
        'Confirmation Needed',
        "Are you sure you want to remove this group from your desktop ?"
      )
      .on('confirm', ()=> {
        store.state.desktop
          .filter(item => (item.path.length > 0 && item.path[0] === category) || (item.path.length === 0 && category === "NO CATEGORY"))
          .forEach(item => {
            self.removeFromDesktop(item);
          });
      });
    },
    /**
     * Remove an item from the desktop
     * @param  {object} item the item in the current store
     */
    removeFromDesktop : function(item) {     
      let filePath = path.join(
        service.config.store.get("ctdbFolderPath"),
        item.filename
      );
      service.config.removeDesktopItem(filePath);
      store.commit('removeFromDesktopById',item.data._id);
    },
    /**
     * Add one or more files to the current desktop.
     * Each file must be stored under the CTDB folder and not be already present
     * in the desktop.
     *
     * @param  {[string]} filenames List of select filenames (absolute)
     */
    addFilesToDesktop : function(filenames) {
      let ctdbBasePath = service.config.store.get("ctdbFolderPath");
      if( Array.isArray(filenames) ) {
        filenames.forEach(file => {
          // check if this file is under the CTBD base folder
          var relativeFilePath = file.replace(ctdbBasePath,'');
          if(relativeFilePath === file) {
            service.notification.warning(
              "It is not permitted to select an item out of the base folder"
            );
          } else {
             let newItemData = JSON.parse(fs.readFileSync(file, 'utf8'));
             if( store.getters.desktopItemById(newItemData._id) ) {
               service.notification.warning(
                 `The item is already part of your desktop : <pre>${relativeFilePath}</pre>`,
                 "Oups !"
               );

               // Animate (shake) the existing desktop item Modify directly the DOM using
               // the computed element id that has been defined by the template

               //let elementId = "dkitem-id-"+newItemData.id;
               let elementId = this.getItemElementId(newItemData);
               let div = document.getElementById(elementId);
               if( div ) {
                 if( div.classList.contains('animated') === false) {
                   div.classList.add('animated');
                 }
                 if( div.classList.contains('shake')) {
                   div.classList.remove('shake');
                 }
                 // on next tick add the effect (otherwise it is not applied)
                 setTimeout(function(){
                   div.classList.add('shake');
                 },100);
               }
             } else {
               // normalize the item to ensure that some properties (added lately) are set
               if( ! newItemData.commands ) {
                 newItemData.commands = [];
               }
               if( ! newItemData.repo ) {
                newItemData.repo = {
                   template : null
                 };
               }
               if( ! newItemData.vars ) {
                newItemData.vars = [];
               }
               // store the item
              store.commit('addToDesktop',{
                "data"       : newItemData,
                "filename"   : relativeFilePath,
                "isSelected" : false,
                "isAlive"    : null, // NULL = don't know, TRUE = servier alive, FALSE = server not responding
                "inProgress" : false,
                "isAliveStatusMessage" : "",
                "name"     : path.basename(relativeFilePath),
                "path"     : path.dirname(relativeFilePath)
                              .split(path.sep)
                              .filter( token => token.length !== 0)
              });
              service.config.store.set('recent.ctdbPath',path.dirname(file));
              service.config.addDesktopItem(file);
            }
          }
        });
      }
    },
    /**
     * Opens a file selection dialog box (native) so the user can select one or more
     * item that will be added to the desktop.
     *
     * @param  {mixed} defaultPath  if a string is provided, it is assumed to be a
     * path relative to CTDB folder path and is used to initialized the defaultPath.
     * Otherwise it is ignored
     */
    openDesktopItems : function(defaultPath) {
      let defPath = service.config.getRecentCTDBPath();
      if( defaultPath && typeof defaultPath === "string") {
        defPath = path.join(
          service.config.store.get("ctdbFolderPath"),
          defaultPath
        );
      }
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"       : "Select Item",
          "defaultPath" : defPath,
          "properties"  : [ 'openFile', 'multiSelections']
        },
        this.addFilesToDesktop
      );
    }
  },
  mounted : function () {

    // Desktop initialization //////////////////////////////////////////////////

    if( service.config.store.get('persistentDesktop')
        && store.state.desktopLoadedOnInit === false )
    {
      console.log('loading desktop from config file');
      let persistentDekstopItems = service.config.getDesktopItems();
      if( persistentDekstopItems.length > 0 ){
        this.addFilesToDesktop(persistentDekstopItems);
      }
      store.commit('desktopLoaded');
    }

    // register key shortcut ///////////////////////////////////////////////////

    let self = this;
    Mousetrap.bind(['command+o', 'ctrl+o'], function() {
        self.openDesktopItems();
        return false;
    });

    Mousetrap.bind(['command+n', 'ctrl+n'], function() {
        self.createItem();
        return false;
    });

    Mousetrap.bind(['command+w', 'ctrl+w'], function() {
        self.clearDesktop();
        return false;
    });

  }
};
