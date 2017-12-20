const store     = require('../../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
const helper    = require('../../../../lib/lib').helper;
var persistence = require('../../../../lib/lib').persistence;

module.exports = {
  store,
  components : {
    "tomcat"    : require('./tomcat/main')
  },
  data : function(){
    return {
      item          : null,
      disableAction : false,
      expandAll     : true,
      // manage view display,
      expandTomcat : true,
      expandWebapp : true
    };
  },
  template: require('./main.html'),
  methods : {
    viewTomcatClass : function() {
      return this.expandTomcat
        ? ["glyphicon", "glyphicon-eye-close"]
        : ["glyphicon", "glyphicon-eye-open"];
    },
    viewWebappClass : function() {
      return this.expandWebapp
        ? ["glyphicon", "glyphicon-eye-close"]
        : ["glyphicon", "glyphicon-eye-open"];
    },
    toggleWebappView : function() {
      this.expandWebapp = ! this.expandWebapp;
    },
    toggleTomcatView : function() {
      this.expandTomcat = ! this.expandTomcat;
    },
    addTomcat : function() {
      console.log('addTomcat');
      this.$store.commit('addTomcat', {
        "item" : this.item,
        "tomcat" : {
          "_id"     : helper.generateUUID(),
          "id"      : "",
          "port"    : 0,
          "webapps" : []
        }
      });
      persistence.saveDesktopnItemToFile(this.item);
    }
  },
  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
   mounted : function(){
     // find the desktop item in the store
     this.item = this.$store.getters.desktopItemById(this.$route.params.id);
   }
};
