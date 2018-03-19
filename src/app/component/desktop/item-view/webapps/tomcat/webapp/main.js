const validate    = require('validator');
const notify      = require('../../../../../../service/notification');
const persistence = require('../../../../../../service/persistence');
const service     = require('../../../../../../service/service').service;
const helper      = require('../../../../../../lib/lib').helper;
const shell       = require('electron').shell;

module.exports = {
  props: ['item', 'tomcat', 'webapp', 'expandWebapp'],
  components: {
    "servlet"      : require('./servlet/main'),
    "inlineInput2" : require('../../../../../../lib/component/inline-input-2')
  },
  data: function() {
    return {
      validation: {
        "name"        : true,
        "contextPath" : true,
        "version"     : true
      },
      expanded : this.expandWebapp,
      referenceWebappSelection : this.webapp.refId
    };
  },
  template: require('./main.html'),
  computed: {
    webappURL: function() {
      return `http://${this.item.data.ssh.host}:${this.tomcat.port}${this.webapp.contextPath}`;
    },
    webappDefinitionOptions : function() {
      return this.$store.state.webappDefinition.map( module => {
        return {
          "id"   : module.id,
          "name" : `${module.id} - ${module.name}`
        };
      });
    },
    btTitleOpenContext : function() {
      return "open ".concat(this.webappURL);
    },
    /**
     * Returns the current version update task, or 'undefined' of no such
     * task exists in the store
     */
    updateVersionTask : function(){
      console.log('computed task');
      return  this.$store.getters['tmptask/taskById'](this.updateVersionTaskId);
    },
    /**
     * Build the id for the task in charge of updating webapp version
     */
    updateVersionTaskId : function() {
      return `webapp-version-${this.webapp._id}`;
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

          // Use the input change flow to update name and contextPath

          this.changeValue({
            "name"  : "name",
            "value" : selectedModule.name
          });

          // by CONVENTOIN set the webapp contextPath to the same value
          // as the module ID (this maybe incorrect in the future)

          this.changeValue({
            "name"  : "contextPath",
            "value" : "/" + selectedModule.id
          });
        }
      }
    }
  },
  methods: {
    /**
     * Start the webapp version update task
     */
    refreshVersion : function(){
      if( ! this.updateVersionTask) {
        this.$store.commit('tmptask/addTask',{
          "id"           : this.updateVersionTaskId,
          "step"         : "UPDATE",
          "status"       : "PROGRESS",
          "result"       : null,
          "errorMessage" : ""
        });
      }
      let self = this;
      let fakeVersionUpdater = new Promise( (resolve, reject)=> {
        setTimeout( () => {
          resolve("1.0.0");
        },1000);
      });
      fakeVersionUpdater
      .then( version => {
        // see same method in ../main.js
        self.$store.commit('updateWebapp',{
          "item"       : self.item,
          "tomcat"     : self.tomcat,
          "webapp"     : self.webapp,
          "updateWith" : {
            "version" : version
          }
        });
        // save updated item to file
        persistence.saveDesktopItemToFile(self.item);
        // delete the update version task
        self.$store.commit('tmptask/deleteTask',{
          "id" : self.updateVersionTaskId
        });
      })
      .catch(error => {
        // delete the update version task
        this.$store.commit('tmptask/deleteTask',{
          "id" : this.updateVersionTaskId
        });
      });
    },
    /**
     * Open the url of this webapp context into an external browser
     */
    openWebappContext : function() {
      shell.openExternal(this.webappURL);
    },
    /**
     * Add a servlet to the current webapp
     */
    addServlet : function() {
      this.$store.commit('addServlet', {
        "item"    : this.item,
        "tomcat"  : this.tomcat,
        "webapp"  : this.webapp,
        "servlet" : {
          "_id"         : helper.generateUUID(),
          "name"        : "",
          "class"       : "",
          "urlPatterns" : []
        }
      });
      persistence.saveDesktopItemToFile(this.item);
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
      service.notification.confirm(
        'Confirmation Needed',
        `Are you sure you want to delete the webapp <code>${self.webapp.name}</code>?`
      )
      .on('confirm', ()=> {
        self.$store.commit('deleteWebapp', {
          "item"      : self.item,
          "tomcat"    : self.tomcat,
          "webapp"    : self.webapp
        });
        persistence.saveDesktopItemToFile(self.item);
      });
    },
    changeValue: function(arg) {
      if (arg.name === "contextPath") {
        if (validate.isEmpty(arg.value)) {
          this.validation.contextPath = false;
        } else {
          // check duplicate contextPath
          let existingWebapp = this.tomcat.webapps.find(webapp => webapp.contextPath === arg.value);
          if (existingWebapp) {
            service.notification.warning(
              'Warning',
              `The contextPath <b>${arg.value}</b> is already in use by web app <b>${existingWebapp.name}</b>`
            );
            this.validation.contextPath = false;
          } else {
            this.validation.contextPath = true;
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
      persistence.saveDesktopItemToFile(this.item);
    }
  }
};
