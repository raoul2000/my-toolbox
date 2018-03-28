var remote     = require('electron').remote;
var fs         = require('fs');
var path       = require('path');
const store    = require('../../service/store/store');
const config   = require('../../service/config');
const helper   = require('../../lib/lib').helper;

const service   = require('../../service/service').service;

/**
 * The Desktop view allows the user to load one more items from the ctdb folder path into the main view
 * From there, the user can perform actions on desktop items.
 */
module.exports = {
  store,
  data : function(){
    return {
      groupByCategory : config.store.get("desktopGroupByCategory")
    };
  },
  template: require('./main.html'),
  computed : {
    items : function(){
      return store.state.desktop;
    },
    topLevelCategories : function() {
      let keys = helper.groupBy(store.state.desktop, item => {
        if( item.path.length === 0) {
          return "NO CATEGORY";
        } else {
          return item.path[0];
        }
      }).keys();
      return Array.from(keys);
    }
  },
  methods : {
    addItemToGroup : function(category) {
      this.openDesktopItems(category);
    },
    /**
     * Remove All items from the desktop and save the new desktop state (empty)
     * in the current config.
     */
    clearDesktop : function(){
      if( store.state.desktop.length === 0) {
        return;
      }
      let self = this;
      service.notification.confirm(
        'Confirmation Needed',
        "Are you sure you want to clear your desktop ?"
      )
      .on('confirm', ()=> {
        self.$store.commit('removeAllItems');
        config.clearDesktop();
      });
    },
    itemsByCategory : function(category) {
      console.log("itemsByCategory",category);
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
      <div class="card-name">${name}</div>`;

      if( extraInfo.length > 0) {
        html = html.concat(`<div class="card-extra">${extraInfo}</div>`);
      }
      if( item.data.ssh.host ) {
        html = html.concat(`<div class="card-extra">host : ${item.data.ssh.host}</div>`);
      } else {
        html = html.concat(`<div class="card-extra">host : <span class="label label-danger">missing host</span></div>`);
      }
      return html;
    },
    /**
     * Provides the appropriate CSS classes to be attached to the card container block.
     * Searched among the item path tokens for a specific string and add its matching
     * class to the class array returned to the view
     */
    cardItemStyle: function (item) {
      let validEnv = {
        'dev'  : "project-success",
        'qa'   : "project-primary",
        'prod' : "project-danger"
      };
      let validEnvKeys = Object.keys(validEnv);
      let classes = [ "project"];
      let thisEnv = item.path
        .filter( token => validEnvKeys.indexOf(token.toLowerCase()) > -1 )
        .map( token => token.toLowerCase());

      if( thisEnv.length === 0) {
        classes.push('project-default');
      } else {
        classes.push(validEnv[thisEnv[0]]);
      }
      return classes;
    },
    /**
     * Saves an empty item to file
     */
    createItem : function(category) {
      let defaultPath = config.getRecentCTDBPath();
      if( category && typeof category === "string") {
        defaultPath = path.join(
          config.store.get("ctdbFolderPath"),
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
        "entities"   : [],
        "tomcats"    : [],
        "components" : [],
        "commands"   : []
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
            let ctdbBasePath = config.store.get("ctdbFolderPath");
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
                  config.store.set('recent.ctdbPath',path.dirname(filename));
                  config.addDesktopItem(filename);
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
      config.store.set('desktopGroupByCategory', this.groupByCategory);
    },
    /**
     * Opens a view for a specific item.
     *
     * @param  {inetger} index index of the item in the current store
     */
    viewDetail : function(item, event) {
      if(event.target.closest(".btn") === null) { // make sure user clicked on the button
        // to push a route with a query param use :
        // this.$router.push({ path: '/item-view', query: { "id": item.data._id }})
        this.$router.push({ path: `/item-view/${item.data._id}/settings`});
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
     * Remove an item from the desktopn
     * @param  {object} item the item in the current store
     */
    removeFromDesktop : function(item) {
      let filePath = path.join(
        config.store.get("ctdbFolderPath"),
        item.filename
      );
      config.removeDesktopItem(filePath);
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
      let ctdbBasePath = config.store.get("ctdbFolderPath");
      if( Array.isArray(filenames) ) {
        filenames.forEach(file => {
          // check if this file is under the CTBD base folder
          var relativeFilePath = file.replace(ctdbBasePath,'');
          if(relativeFilePath === file) {
            service.notification.warning(
              "It is not permitted to select an item out of the base folder"
            );
            //notify('It is not permitted to select an item out of the base folder','error','Error');
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
               if( ! newItemData.commands ) {
                 newItemData.commands = [];
               }
              store.commit('addToDesktop',{
                "filename" : relativeFilePath,
                "data"     : newItemData,
                "name"     : path.basename(relativeFilePath),
                "path"     : path.dirname(relativeFilePath)
                              .split(path.sep)
                              .filter( token => token.length !== 0)
              });
              config.store.set('recent.ctdbPath',path.dirname(file));
              config.addDesktopItem(file);
            }
          }
        });
      }
    },
    /**
     * Opens a file selection dialog box (native) so the user can select one or more
     * item that will be added to the desktop.
     *
     *
     * @param  {mixed} defaultPath  if a string is provided, it is assumed to be a
     * path relative to CTDB folder path and is used to initialized the defaultPath.
     * Otherwise it is ignored
     */
    openDesktopItems : function(defaultPath) {
      let defPath = config.getRecentCTDBPath();
      if( defaultPath && typeof defaultPath === "string") {
        defPath = path.join(
          config.store.get("ctdbFolderPath"),
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

    if( config.store.get('persistentDesktop')
        && store.state.desktopLoadedOnInit === false )
    {
      console.log('loading desktop from config file');
      let persistentDekstopItems = config.getDesktopItems();
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
