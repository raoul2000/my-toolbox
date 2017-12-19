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
      // manage view display
      collapseTomcatView : false,
      collapseWebappView : false
    };
  },
  template: require('./main.html'),
  methods : {
    toggleWebappView : function() {
      this.collapseWebappView = ! this.collapseWebappView;
      let self = this;
      document.querySelectorAll(".tomcat-container").forEach( node => {
        if(  self.collapseWebappView ) {
          node.classList.add('collapse-webapp-info');
        } else {
          node.classList.remove('collapse-webapp-info');
        }
      });
    },
    toggleTomcatView : function() {
      this.collapseTomcatView = ! this.collapseTomcatView;
      let self = this;
      document.querySelectorAll(".tomcat-container").forEach( node => {
        if( self.collapseTomcatView ) {
          node.classList.add('collapse-tomcat');
        } else {
          node.classList.remove('collapse-tomcat');
        }
      });
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
