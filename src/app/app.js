

const Desktop  = require('./component/desktop/main');
const Settings = require('./component/settings/main');
const About    = require('./component/about/main');
const DbNav    = require('./component/db-explorer/main');
const Create   = require('./component/create/main');
const store    = require('./service/store/store');


const router = new VueRouter({
  routes :[
    { path: '/desktop', component: Desktop, name : 'desktop' },
    { path: '/settings', component: Settings, name : 'settings'},
    { path: '/create', component: Create, name : 'create'}
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
      console.log('$route',this.$route);
    }
  },
  methods : {
    showMainView : function() {
      return this.loading === false && this.currentRoute !== 'settings';
    },
    showToolbar : function() {
      return this.currentRoute !== 'settings';
    }
  },
  created: function () {
    this.$router.push('/desktop');  // default route
    this.loading = false;
  },
  mounted : function() {
  }
}).$mount('#app');
