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
      // check data folder exist
      if(config.has('dataFolder') === false ) {
        notify('Data folder not defined','error', 'error');
        return;
      }

      // check that data folder exists
      var dataFolder = config.get('dataFolder');
      if ( fs.existsSync(dataFolder) === false ) {
        notify(`Configured Data Folder Not Found : <b>${dataFolder}</b>`,'error', 'error');
        return;
      }

      // load web-app reference dictionnary into the store
      var webappDefFilename = path.join(path.dirname(config.path),'web-app-def.json');
      console.log("loading ",webappDefFilename);
      if ( fs.existsSync(webappDefFilename) === false ) {
        notify(`Configuration file not found : some feature may not be available <br/><code>${webappDefFilename}</code>`,'warning', 'warning');
      } else {
        var obj = JSON.parse(fs.readFileSync(webappDefFilename, 'utf8'));
        store.commit(
          'setWebAppDefinition',
          Object.keys(obj).map( k => obj[k])
        );
      }
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
