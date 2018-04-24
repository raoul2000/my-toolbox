const store       = require('../../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
const helper      = require('../../../../lib/lib').helper;
var persistence   = require('../../../../service/persistence');
var tomcatVersion = require('../../../../service/version/tomcat');
const config           = require('../../../../service/config');
const DummyTaskService = require('../../../../service/dummy-task');
var service            = require('../../../../service/service').service;

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
      expandAll     : false,
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
    updateAllTomcatVersion : function() {
      let self = this;
      this.allowEdit = false;
      DummyTaskService.submitTask({
        "id"    : this.updateVersionTaskId,
        "type"  : "update-tomcat-version-batch",
        "input" : {
          "item"       : this.item.data,
          "tomcatId"   : this.item.data.tomcats.map( tomcat => tomcat._id) // internal ID (not the name)
        }
      })
      .promise
      .then( results => {
        /**
         * results = [
         *  {
         *    "id" : "123e-9987r-998",
         *    "result" : [
         *      { "error" : .. , "resolved" : ..., "value" : "7.0.17"},
         *      { "error" : .. , "resolved" : ..., "value" : "7.0.17"}
         *    ]
         *  }, ...
         * ]
         */
        self.allowEdit = true;
      })
      .catch( err => {
        service.notification.error(err,"Failed to Connect");
        self.allowEdit = true;
      });
    },
    /**
     * Update version of all tomcat owner by this component.
     * The actual version scan is delegated to the tomcatVersion service.
     */
    updateAllTomcatVersion_orig : function() {
      tomcatVersion
        .upddateTomcats(
          this.item.data,
          this.item.data.tomcats.map( tomcat => tomcat._id)
        )
        .then(results => {
          console.log(results);

          results
            .filter( result => result.resolved )
            .map( result => result.value)
            .forEach( result => {
              let tomcat = this.item.data.tomcats.find( tomcat => tomcat._id === result._id);
              if( tomcat ) {
                let finalVersion = tomcatVersion.chooseBestResultValue(result.values);
                // TODO : updating tomcat version will cause a saveToFile FOR EACH tomcat !
                // There should be a way to update all tomcats version and then save to file only once
                this.$store.commit('updateTomcat',{
                  "item"       : this.item,
                  "tomcat"     : tomcat,
                  "updateWith" : {
                    "version" : finalVersion
                  }
                });
                tomcatVersion.finalize(tomcat);
              } else {
                console.warn("tomcat not found : id = "+result._id);
              }
            });
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
      persistence.saveDesktopItemToFile(this.item);
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
         "expandTomcat": config.store.get("expandTomcatView"),
         "expandWebapp": config.store.get("expandWebappView")
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
