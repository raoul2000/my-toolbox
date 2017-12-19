const validate    = require('validator');
const notify      = require('../../../../../../service/notification');
const persistence = require('../../../../../../lib/lib').persistence;

module.exports = {
  props: ['item', 'tomcat', 'webapp'],
  components: {
    "inlineInput2": require('../../../../../../lib/component/inline-input-2')
  },
  data: function() {
    return {
      validation: {
        "name": true,
        "path": true
      },
      "referenceWebappSelection" : this.webapp.refId
    };
  },
  template: require('./main.html'),
  computed: {
    webappURL: function() {
      return `http://${this.item.data.ssh.host}:${this.tomcat.port}${this.webapp.path}`;
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

          // Use the input change flow to update name and path

          this.changeValue({
            "name"  : "name",
            "value" : selectedModule.name
          });
          if(selectedModule.path ) {
            this.changeValue({
              "name"  : "path",
              "value" : selectedModule.path
            });
          }
        }
      }
    }
  },
  methods: {
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
      if (arg.name === "path") {
        if (validate.isEmpty(arg.value)) {
          this.validation.path = false;
        } else {
          // check duplicate path
          let existingWebapp = this.tomcat.webapps.find(webapp => webapp.path === arg.value);
          if (existingWebapp) {
            notify(`The path <b>${arg.value}</b> is already in
              use by web app <b>${existingWebapp.name}</b>`, 'warning', 'warning');
            this.validation.path = false;
          } else {
            this.validation.path = true;
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
      persistence.saveDesktopnItemToFile(this.item);
    }
  }
};
