'use strict';

const helper  = require('../../../../lib/lib').helper;
var service   = require('../../../../service/index');
const version = require('../../../../service/version/tomcat');

const VIEW_ID = "webapp-tab";

module.exports = {
  components : {
    "tomcat"    : require('./tomcat/main'),
    'scan'      : require('./scan/main')
  },
  data : function(){
    return {
      item          : null,
      disableAction : false,
      expandAll     : false,
      // filter : passed to the tomcat component to be applied on
      // webapps
      filterText    : "",
      openScanModal : false,
      isReadOnly    : service.db.isReadOnly()
    };
  },
  template: require('./main.html'),
  computed : {
    view : function() {
      return this.$store.getters['view/findById'](VIEW_ID);
    },
    /**
     * Returns array of tomcat mathing current filter.
     * Match is done on the webapp reference ID contained by the tomcat
     */
    filteredTomcats : function() {
      if( this.filterText.trim().length === 0) {
        return this.item.data.tomcats;
      } else {
        let normalizedFilter = this.filterText.toLowerCase();
        return this.item.data.tomcats.filter( tomcat => {
          return tomcat.webapps
            .some( webapp => webapp.name.concat(webapp.refId).toLowerCase().match(normalizedFilter));
        });
      }
    },
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
    /**
     * Update version of all tomcat owner by this component.
     * The actual version scan is delegated to the tomcatVersion service.
     */
    updateAllTomcatVersion : function() {
      let self = this;
      this.allowEdit = false;
      version.updateTomcatBatch(
        this.item.data,
        this.item.data.tomcats.map( tomcat => tomcat._id)
      )
      .then( results => {
        /**
         * results = [
         *  { "tomcatId" : "123e-9987r-998", "version" : "1.2.0" },
         *  { "tomcatId" : "3445-9987r-998", "version" : "1.3.0" },
         *  ...
         * ]
         */
        results.forEach( result => {
          let tomcat = self.item.data.tomcats.find( tomcat => tomcat._id === result.tomcatId);
          if(tomcat) {
            self.$store.commit('updateTomcat',{
              "item"       : self.item,
              "tomcat"     : tomcat,
              "updateWith" : {
                "version" : result.version
              }
            });
          }
        });
        self.allowEdit = true;
      })
      .catch( err => {
        service.notification.error(err,"Failed to Connect");
        self.allowEdit = true;
      });
    },

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
          "version" : "",
          "webapps" : []
        }
      });
      service.persistence.saveDesktopItemToFile(this.item);
    }
  },
  /**
   * Load the parent item using route param 'id' and install keyboard shortcuts
   */
   mounted : function(){
     // find the desktop item in the store
     this.item = this.$store.getters.desktopItemById(this.$route.params.id);
     if( ! this.view ) {
       this.$store.commit('view/add',{
         "id"          : VIEW_ID,
         "childViewId" : "TOMCAT_LIST",
         "expandTomcat": service.config.store.get("expandTomcatView"),
         "expandWebapp": service.config.store.get("expandWebappView")
       });
     }

     // keyboard shortcut to set the focus on webapp filter
     let self = this;
     Mousetrap.bind(['command+f', 'ctrl+f'], function() {
         self.$refs.inputWebappFilter.focus();
         return false;
     });

   }
};
