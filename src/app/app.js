const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const path     = require('path');
const fs       = require('fs');

const router   = require('./router');
const store    = require('./service/store/store');
const config   = require('./service/config');
const service  = require('./service/index');

let shell = require('electron').shell;

// listen to all click events on an anchor having an 'http' href and opens
// an external browser on the URL

document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});


// The main app vue component is created here
const app = new Vue({
  router,
  data : function() {
    return {
      loading       : true,
      isReadOnly    : service.db.isReadOnly()
    };
  },
  watch: {
    /**
     * Store the current route name
     */
    '$route' (to, from) {
      // TODO : this may not be useful as any component should have access to the current route
      // using this.$route
      store.commit('setCurrentRoute',this.$route.name);
    }
  },
  methods : {
    /**
     * Displays the about modal dialog box
     */
    showAbout : function() {
      var self = this;
      $('#modal').modal("show").one('hidden.bs.modal', function (e) {
        self.$emit('close');
      });
    },
    /**
     * Hides/shows the main top toolbar depending on the current route name
     */
    showToolbar : function() {
      return ['settings','tc-scan'].findIndex( routePath => routePath === this.$route.name) === -1;
    },
    /**
     * Check current configuration and load the webapp definition file
     */
    initApplication : function() {

      // CTDB Path /////////////////////////////////////////////////////////////

      if(config.store.has('ctdbFolderPath') === false ) {
        service.notification.error(  'CTDB folder not defined');
        return;
      }
      var ctdbFolderPath = config.store.get('ctdbFolderPath');
      if ( fs.existsSync(ctdbFolderPath) === false ) {
        // try to create path but only if parent folder exists
        if( fs.existsSync(path.dirname(ctdbFolderPath))) {
            fs.mkdirSync(ctdbFolderPath, 0744);
        } else {
          service.notification.error(`Failed to create CTDB path : <b>${ctdbFolderPath}</b><br/> Make sure that parent folder exists`);
          return;
        }
      }

      // load DB metadata
      service.db.open();

      // webappCatalogFilePath /////////////////////////////////////////////////////

      if(config.store.has('webappCatalogFilePath') === false ) {
        service.notification.error('Web-App Catalog file path not configured');
        return;
      }
      var webappCatalogFilePath = config.store.get('webappCatalogFilePath');
      if ( fs.existsSync(webappCatalogFilePath) === false ) {
        service.notification.error(`Configured Web-App Catalog file path Not Found : <b>${webappCatalogFilePath}</b>`);
        return;
      }
      // load webapp Catalog
      var obj = JSON.parse(fs.readFileSync(webappCatalogFilePath, 'utf8'));
      store.commit(
        'setWebAppDefinition',
        Object.keys(obj).map( k => obj[k])
      );

      // commandLibrary /////////////////////////////////////////////////////
      //
      if(config.store.has('commandLibraryFilePath') === false ) {
        service.notification.error('Command Library file path not configured');
        return;
      }
      var commandLibraryFilePath = config.store.get('commandLibraryFilePath');
      if ( fs.existsSync(commandLibraryFilePath) === false ) {
        service.notification.error(`Configured Command Library file path Not Found : <b>${commandLibraryFilePath}</b>`);
        return;
      }
      // load webapp Catalog
      var cmdLib = JSON.parse(fs.readFileSync(commandLibraryFilePath, 'utf8'));
      cmdLib.forEach(cmd => {
        store.commit('command/add',cmd);
      });
    }
  },
  /**
   * Set the default route to be displayed in the main view
   */
  created: function () {
    this.$router.push('/desktop');  // default route
  },
  mounted : function() {
    this.initApplication();
    this.loading = false;

    // the 'app-loaded' event causes the splash screen to hide and the main
    // app view to show
    ipcRenderer.send('app-loaded');
  }
}).$mount('#app');
