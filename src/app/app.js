

const Desktop  = require('./component/desktop/main');
const Settings = require('./component/settings/main');
const About    = require('./component/about/main');
const DbNav    = require('./component/db-explorer/main');
const Create   = require('./component/create/main');
const View     = require('./component/view/main');
const store    = require('./service/store/store');
const config   = require('./service/config');
const notify   = require('./service/notification');

const path = require('path');
const fs   = require('fs');

const router = new VueRouter({
  routes :[
    { path: '/desktop',  component: Desktop,  name : 'desktop' },
    { path: '/settings', component: Settings, name : 'settings'},
    { path: '/create',   component: Create,   name : 'create'},
    { path: '/view',     component: View,     name : 'view'}
  ]
});

const app = new Vue({
  router,
  components: { Desktop },
  data : function() {
    return {
      loading: true,
      currentRoute : null,
      message : "hello !",
      showAbout : false
    };
  },
  watch: {
    '$route' (to, from) {
      this.currentRoute = this.$route.name;
      store.commit('setCurrentRoute',this.$route.name);

      //console.log('$route',this.$route);

      // TODO : check if using router.go(n) would not be enough to goBack from Setting
      // see https://router.vuejs.org/en/essentials/navigation.html

      // to be able to go back to previous route before "settings" do not
      // commit route when equal to 'settings'
      // not needed anymore
      /*if( this.currentRoute !== 'settings') {
        store.commit('setCurrentRoute',this.$route.name);
      }*/
    }
  },
  methods : {
    showMainView : function() {
      return this.loading === false && this.currentRoute !== 'settings';
    },
    showToolbar : function() {
      return this.currentRoute !== 'settings';
    },
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

      // load web-app reference dictionnary
      var filename = path.join(path.dirname(config.path),'web-app-ref.json');
      console.log("loading ",filename);
    }
  },
  created: function () {
    this.$router.push('/desktop');  // default route
    this.loading = false;
  },
  mounted : function() {
    this.initApplication();

  }
}).$mount('#app');
