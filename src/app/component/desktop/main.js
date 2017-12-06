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
    /**
     * Creates and returns the HTML content of a card item
     */
    cardItemContent : function(item) {
      let title = item.path.length > 0 ? item.path[0] : "no name";
      let name = item.name;
      let extraInfo = item.path.length > 1 ? item.path.filter( (token, index) => index > 0).join(' - ') : "";

      let html = `<div class="card-title" title="${title}">${title}</div>
      <div class="card-name">${name}</div>`;
      if( extraInfo.length > 0) {
        html = html.concat(`<div class="card-extra">${extraInfo}</div>`);
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
     * Navigate to the Item creation page
     */
    createItem : function() {
      this.$router.push('/create');
    },
    /**
     * Opens a view for a specific item.
     *
     * @param  {inetger} index index of the item in the current store
     */
    viewDetail : function(index, event) {
      if(event.target.closest(".btn") === null) { // make sure user clicked on the button
        // to push a route with a query param use :
        // this.$router.push({ path: '/item-view', query: { "index": index }})
        this.$router.push({ path: `/item-view/${index}/settings`});
        event.stopPropagation();
      }
    },
    /**
     * Remove an item from the desktopn
     * @param  {integer} index the item index in the current store
     */
    removeFromDesktop : function(index) {
      store.commit('removeFromDesktop',index);
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
            notify('It is not permitted to select an item out of the base folder','error','Error');
          } else {
             let itemIndex = store.getters.desktopItemIndexByFilename(relativeFilePath);
             if( itemIndex !== -1 ) {
               notify(`The item is already part of your desktop :
                 <pre>${relativeFilePath}</pre>`,'warning','warning');
               // Animate (shake) the existing desktop item
               // Modify directly the DOM using the computed element id that has
               // been defined by the template
               let elementId = "dkitem-idx"+itemIndex;
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
              store.commit('addToDesktop',{
                "filename" : relativeFilePath,
                "data"     : JSON.parse(fs.readFileSync(file, 'utf8')),
                "name"     : path.basename(relativeFilePath,".json"),
                "path"     : path.dirname(relativeFilePath)
                              .split(path.sep)
                              .filter( token => token.length !== 0)
              });
              config.store.set('recent.ctdbPath',path.dirname(file));
            }
          }
        });
      }
    },
    /**
     * Opens a file selection dialog box (native) so the user can select one or more
     * item that will be added to the desktop.
     */
    openDesktopItems : function() {
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select Item",
          "defaultPath" : config.getCTDBPath(),
          "properties" : [ 'openFile', 'multiSelections']
        },
        this.addFilesToDesktop
      );
    }
  }
};
