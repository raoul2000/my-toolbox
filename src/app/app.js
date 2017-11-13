const path     = require('path');
const fs       = require('fs');

const Desktop  = require('./component/desktop/main');
const Settings = require('./component/settings/main');
const About    = require('./component/about/main');
const DbNav    = require('./component/db-explorer/main');
const Create   = require('./component/create/main');
const View     = require('./component/view/main');
const Deploy   = require('./component/deploy/main');
const MavenDownload   = require('./component/maven-download/main');

const store    = require('./service/store/store');
const config   = require('./service/config');
const notify   = require('./service/notification');

let shell = require('electron').shell;
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});

// register routes
const router = new VueRouter({
  routes :[
    { path: '/desktop',  component: Desktop,  name : 'desktop' },
    { path: '/settings', component: Settings, name : 'settings'},
    { path: '/create',   component: Create,   name : 'create'},
    { path: '/view',     component: View,     name : 'view'},
    { path: '/deploy',   component: Deploy,   name : 'deploy'},
    { path: '/maven-download',   component: MavenDownload,   name : 'maven-download'}
  ]
});

// The main app vue component is created here
const app = new Vue({
  router,
  data : function() {
    return {
      loading       : true,
      currentRoute  : null,
      showAbout     : false
    };
  },
  watch: {
    /**
     * Store the current route name
     */
    '$route' (to, from) {
      this.currentRoute = this.$route.name;
      store.commit('setCurrentRoute',this.$route.name);
    }
  },
  methods : {
    showToolbar : function() {
      return this.currentRoute !== 'settings';
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
    this.loading = false;
  },
  mounted : function() {
    this.initApplication();
  }
}).$mount('#app');
