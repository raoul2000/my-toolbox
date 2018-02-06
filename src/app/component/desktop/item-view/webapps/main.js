const store     = require('../../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
const helper    = require('../../../../lib/lib').helper;
var persistence = require('../../../../lib/lib').persistence;

const VIEW_ID = "webapp-tab";

module.exports = {
  store,
  components : {
    "tomcat"    : require('./tomcat/main'),
    'scan'      : require('./scan/main')
  },
  data : function(){
    return {
      item          : null,
      disableAction : false,
      expandAll     : true,
      // filter : passed to the tomcat component to be applied on
      // webapps
      filterText    : "",
      openScanModal : false
    };
  },
  template: require('./main.html'),
  computed : {
    view : function() {
      return this.$store.getters['view/findById'](VIEW_ID);
    }
  },
  watch : {
    filterText : function() {
      if(this.filterText.trim().length !== 0) {
        // TODO : this will not trigger expand/collapse because the
        // details view may already be expanded : in this case there is no
        // change .. no redraw :(
        if( this.view.expandTomcat === false) {
          this.toggleTomcatView();
        }
      }
    }
  },
  methods : {
    closeScannerView : function() {
      this.$store.commit('view/update', {
        "id" : VIEW_ID,
        "updateWith" : {
          "childViewId"   : "TOMCAT_LIST"
        }
      });
    },
    openScannerView : function() {
      this.$router.push({ path: `/tc-scan/${this.item.data._id}`});
      /*
      this.$store.commit('view/update', {
        "id" : VIEW_ID,
        "updateWith" : {
          "childViewId"   : "SCANNER"
        }
      });*/
    },
    viewTomcatClass : function() {
      return this.view.expandTomcat
        ? ["glyphicon", "glyphicon-eye-close"]
        : ["glyphicon", "glyphicon-eye-open"];
    },
    viewWebappClass : function() {
      return this.view.expandWebapp
        ? ["glyphicon", "glyphicon-eye-close"]
        : ["glyphicon", "glyphicon-eye-open"];
    },
    toggleWebappView : function() {
      this.$store.commit('view/update', {
        "id" : VIEW_ID,
        "updateWith" : {
          "expandWebapp"   : ! this.view.expandWebapp
        }
      });
    },
    toggleTomcatView : function() {
      this.$store.commit('view/update', {
        "id" : VIEW_ID,
        "updateWith" : {
          "expandTomcat"   : ! this.view.expandTomcat
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
      persistence.saveDesktopItemToFile(this.item);
    }
  },
  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
   mounted : function(){
     // find the desktop item in the store
     this.item = this.$store.getters.desktopItemById(this.$route.params.id);
     if( ! this.view ) {
       this.$store.commit('view/add',{
         "id"          : VIEW_ID,
         "childViewId" : "TOMCAT_LIST",
         "expandTomcat": true,
         "expandWebapp": true
       });
     }
   }
};
