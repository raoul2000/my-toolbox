const validate    = require('validator');
const notify      = require('../../../../../../service/notification');
const persistence = require('../../../../../../lib/lib').persistence;
const helper      = require('../../../../../../lib/lib').helper;

module.exports = {
  props: ['item', 'tomcat', 'webapp', 'expandWebapp'],
  components: {
    "servlet"      : require('./servlet/main'),
    "inlineInput2" : require('../../../../../../lib/component/inline-input-2')
  },
  data: function() {
    return {
      validation: {
        "name": true,
        "context": true
      },
      expanded : this.expandWebapp,
      referenceWebappSelection : this.webapp.refId
    };
  },
  template: require('./main.html'),
  computed: {
    webappURL: function() {
      return `http://${this.item.data.ssh.host}:${this.tomcat.port}${this.webapp.context}`;
    },
    webappDefinitionOptions : function() {
      return this.$store.state.webappDefinition.map( module => {
        return {
          "id"   : module.id,
          "name" : `${module.id} - ${module.name}`
        };
      });
    }
  },
  watch : {
    /**
     * when parent component triggers expand/collapse the view
     * update the local state of the display
     */
    expandWebapp : function(){
      console.log('expanded');
      this.expanded = this.expandWebapp ? true : false;
    },
    referenceWebappSelection : function() {
      if(this.referenceWebappSelection) {
        let selectedModule = this.$store.state.webappDefinition.find( module => module.id === this.referenceWebappSelection);
        if( selectedModule) {
          // directly updates the store to update the webapp reference id
          this.$store.commit('updateWebapp', {
            "item"      : this.item,
            "tomcat"    : this.tomcat,
            "webapp"    : this.webapp,
            "updateWith": {
              "refId" : selectedModule.id
            }
          });

          // Use the input change flow to update name and context

          this.changeValue({
            "name"  : "name",
            "value" : selectedModule.name
          });

          // by CONVENTOIN set the webapp context to the same value
          // as the module ID (this maybe incorrect in the future)

          this.changeValue({
            "name"  : "context",
            "value" : "/" + selectedModule.id
          });
        }
      }
    }
  },
  methods: {
    /**
     * Add a servlet to the current webapp
     */
    addServlet : function() {
      this.$store.commit('addServlet', {
        "item"    : this.item,
        "tomcat"  : this.tomcat,
        "webapp"  : this.webapp,
        "servlet" : {
          "_id"        : helper.generateUUID(),
          "name"       : "",
          "class"      : "",
          "urlPattern" : ""
        }
      });
      persistence.saveDesktopnItemToFile(this.item);
    },

    toggleDetailView : function() {
      this.expanded = ! this.expanded;
    },
    toggleButtonClass : function() {
      return this.expanded
        ? ["glyphicon", "glyphicon-triangle-bottom"]
        : ["glyphicon", "glyphicon-triangle-right"];
    },
    deleteWebapp : function() {
      let self = this;
      (new PNotify({
          title: 'Confirmation Needed',
          text: `Are you sure you want to delete the webapp <code>${self.webapp.name}</code>?`,
          icon: 'glyphicon glyphicon-question-sign',
          hide: false,
          confirm: {
              confirm: true
          },
          buttons: {
              closer: false,
              sticker: false
          },
          history: {
              history: false
          },
          stack: {"dir1": "down", "dir2": "left", "modal": true, "overlay_close": true}
      })).get().on('pnotify.confirm', function() {
        self.$store.commit('deleteWebapp', {
          "item"      : self.item,
          "tomcat"    : self.tomcat,
          "webapp"    : self.webapp
        });
        persistence.saveDesktopnItemToFile(self.item);
      });
    },
    changeValue: function(arg) {
      if (arg.name === "context") {
        if (validate.isEmpty(arg.value)) {
          this.validation.context = false;
        } else {
          // check duplicate context
          let existingWebapp = this.tomcat.webapps.find(webapp => webapp.context === arg.value);
          if (existingWebapp) {
            notify(`The context <b>${arg.value}</b> is already in
              use by web app <b>${existingWebapp.name}</b>`, 'warning', 'warning');
            this.validation.context = false;
          } else {
            this.validation.context = true;
          }
        }
      }
      // webapp.name is always valid (even if empty)
      let updateInfo = {
        "item"      : this.item,
        "tomcat"    : this.tomcat,
        "webapp"    : this.webapp,
        "updateWith": {}
      };
      updateInfo.updateWith[arg.name] = arg.value;
      this.$store.commit('updateWebapp', updateInfo);
      // FIXME : in some case (to define) the JSON saved by next line is INVALID
      // with additional closing brackets or some other characters
      persistence.saveDesktopnItemToFile(this.item);
    }
  }
};
