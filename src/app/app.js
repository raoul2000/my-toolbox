const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const path     = require('path');
const fs       = require('fs');

const Desktop   = require('./component/desktop/main');
const Settings  = require('./component/settings/main');
const About     = require('./component/about/main');
const TCScanner = require('./component/tc-scan/main');

const DbNav    = require('./component/db-explorer/main');
const Create   = require('./component/create/main');
const View     = require('./component/view/main');

const ItemView            = require('./component/desktop/item-view/main');
const ItemViewSettings    = require('./component/desktop/item-view/general/main');
const ItemViewWebapps     = require('./component/desktop/item-view/webapps/main');
const ItemViewComponents  = require('./component/desktop/item-view/components/main');

const Deploy   = require('./component/deploy/main');
const MavenDownload   = require('./component/maven-download/main');

const store    = require('./service/store/store');
const config   = require('./service/config');
const notify   = require('./service/notification');

let shell = require('electron').shell;

// listen to all click events on an anchor having an 'http' href and opens
// an external browser on the URL

document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});

// register routes
const router = new VueRouter({
  routes :[
    { path: '/deploy',           component: Deploy,           name : 'deploy'},
    { path: '/maven-download',   component: MavenDownload,    name : 'maven-download'},
    { path: '/desktop',          component: Desktop,          name : 'desktop' },
    { path: '/settings',         component: Settings,         name : 'settings'},
    { path: '/create',           component: Create,           name : 'create'},
    { path: '/view',             component: View,             name : 'view'},
    { path: '/tc-scan/:id',      component: TCScanner,        name : 'tc-scan'},
    { path: '/item-view/:id',    component: ItemView,
      children : [
      {
        path: 'settings',
        name : 'server-settings',
        component: ItemViewSettings
      },
      {
        path: 'webapps',
        name : 'server-webapps',
        component: ItemViewWebapps
      },
      {
        path: 'components',
        name : 'server-components',
        component: ItemViewComponents
      }
    ]}
  ]
});

// The main app vue component is created here
const app = new Vue({
  router,
  data : function() {
    return {
      loading       : true,
      showAbout     : false
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
     * Hides/shows the main top toolbar depending on the current route
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
        notify('CTDB folder not defined','error', 'error');
        return;
      }
      var ctdbFolderPath = config.store.get('ctdbFolderPath');
      if ( fs.existsSync(ctdbFolderPath) === false ) {
        // try to create path but only if parent folder exists
        if( fs.existsSync(path.dirname(ctdbFolderPath))) {
            fs.mkdirSync(ctdbFolderPath, 0744);
        } else {
          notify(`Failed to create CTDB path : <b>${ctdbFolderPath}</b><br/> Make sure that parent folder exists`,'error', 'error');
          return;
        }
      }

      // webappCatalogFilePath /////////////////////////////////////////////////////

      if(config.store.has('webappCatalogFilePath') === false ) {
        notify('Web-App Catalog file path not configured','error', 'error');
        return;
      }
      var webappCatalogFilePath = config.store.get('webappCatalogFilePath');
      if ( fs.existsSync(webappCatalogFilePath) === false ) {
        notify(`Configured Web-App Catalog file path Not Found : <b>${webappCatalogFilePath}</b>`,'error', 'error');
        return;
      }
      // load webapp Catalog
      var obj = JSON.parse(fs.readFileSync(webappCatalogFilePath, 'utf8'));
      store.commit(
        'setWebAppDefinition',
        Object.keys(obj).map( k => obj[k])
      );
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
