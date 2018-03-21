const validate  = require('validator');
const notify    = require('../../../../../service/notification');
const helper    = require('../../../../../lib/lib').helper;
var persistence = require('../../../../../service/persistence');
var service     = require('../../../../../service/service').service;
const version   = require('../../../../../service/version/tomcat');

module.exports = {
  props : ['item', 'tomcat', 'expandTomcat', 'expandWebapp', 'filter'],
  components : {
    "webapp"      : require('./webapp/main'),
    "inlineInput" : require('../../../../../lib/component/inline-input'),
  },
  data : function(){
    return {
      validation           : {
        "id"     : true,
        "port"   : true,
        "version": true
      },
      expanded             : this.expandTomcat,
      updateVersionTaskId  : null,
      allowEdit            : true
    };
  },
  template: require('./main.html'),
  computed : {
    filteredWebapps : function() {
      if( this.filter.trim().length === 0) {
        return this.tomcat.webapps;
      } else {
        let normalizedFilter = this.filter.toLowerCase();
        return this.tomcat.webapps.filter( webapp => {
          return webapp.name.concat(webapp.refId).toLowerCase().match(normalizedFilter);
        });
      }
    },
    tomcatManagerURL : function() {
        return `http://${this.item.data.ssh.host}:${this.tomcat.port}/manager/html`;
    },
    btTitleOpenManager : function() {
      return "open Manager at ".concat(this.tomcatManagerURL);
    },
    /**
     * Returns the current version update task, or 'undefined' of no such
     * task exists in the store
     */
    updateVersionTask : function(){
      console.log('computed task');
      return  this.$store.getters['tmptask/taskById'](this.updateVersionTaskId);
    }
  },
  watch : {
    /**
     * when parent component triggers expand/collapse the view
     * update the local state of the display
     */
    expandTomcat : function(){
      this.expanded = this.expandTomcat ? true : false;
    }
  },
  methods : {
    /**
     * Updates the version of the tomcat displayed by this component
     */
    refreshVersion : function() {
      let self = this;
      this.allowEdit = false;
      version.updateTomcat(this.item.data,this.tomcat._id)
      .then( result => {
        let finalVersion = version.chooseBestResultValue(result.values);
        this.$store.commit('updateTomcat',{
          "item"       : this.item,
          "tomcat"     : this.tomcat,
          "updateWith" : {
            "version" : finalVersion.value
          }
        });
        // NOTE : it is not needed to update the file here because this will be done by a change
        // of the version value (see change() below)
        version.finalize(self.tomcat);
        self.allowEdit = true;
      });
    },
    /**
     * Open the browser at the address of thiss tomcat manager
     */
    openTomcatManager : function(url) {
      service.shell.openExternal(this.tomcatManagerURL);
    },
    toggleButtonClass : function() {
      return this.expanded
        ? ["glyphicon", "glyphicon-menu-down"]
        : ["glyphicon", "glyphicon-menu-right"];
    },
    toggleWebappView : function() {
      this.expanded = ! this.expanded;
    },
    addWebapp : function() {
      this.$store.commit('addWebapp', {
        "item"   : this.item,
        "tomcat" : this.tomcat,
        "webapp" : {
          "_id"          : helper.generateUUID(),
          "name"         : "",
          "contextPath"  : "/",
          "version"      : "",
          "refId"        : null, // refer to a webapp in the definition list
          "servlets"     : []
        }
      });
      persistence.saveDesktopItemToFile(this.item);
    },
    deleteTomcat : function(){
      let self = this;
      service.notification.confirm(
        'Confirmation Needed',
        `Are you sure you want to delete the tomcat <code>${self.tomcat.id}</code> and all its webapps ?`
      )
      .on('confirm', ()=> {
        self.$store.commit('deleteTomcat', {
          "item"   : self.item,
          "tomcat" : self.tomcat
        });
        persistence.saveDesktopItemToFile(self.item);
      });
    },
    isUniqueTomcatId : function(id) {
      let lcId = id.toLowerCase();
      return this.item.data.tomcats.findIndex( tc => tc.id.toLowerCase() === lcId) === -1 ;
    },
    isUniqueTomcatPort : function(port) {
      return this.item.data.tomcats.findIndex( tc => tc.port === parseInt(port)) === -1 ;
    },
    changeValue : function(arg) {
      if ( false ) {
        if( arg.name === "id") {
          if(  validate.isEmpty(arg.value)) {
            this.validation.id = false;
          } else if( ! this.isUniqueTomcatId(arg.value)) {
            this.validation.id = false;
            service.notification.warning(
              'Warning',
              `A Tomcat instance with the id <b>${arg.value}</b> is already in use`
            );
          } else {
            this.validation.id = true;
          }
        } else if( arg.name === "port") {
          this.validation.port = false;
          if( ! validate.isInt(arg.value+'',{ gt : 0}) ) {
            service.notification.warning(
              'Warning',
              "The PORT number should be an integer value"
            );
          } else if( ! this.isUniqueTomcatPort(arg.value)) {
            service.notification.warning(
              'Warning',
              `The port <b>${arg.value}</b> is already in use`
            );
          } else {
            this.validation.port = true;
            arg.value = parseInt(arg.value);
          }
        } else if( arg.name === 'version') {
          this.validation.version = true;
        }

      }
      // always update even if not valid !
      let updateInfo = {
        "item"       : this.item,
        "tomcat"     : this.tomcat,
        "updateWith" : {}
      };
      updateInfo.updateWith[arg.name] = arg.value;
      this.$store.commit('updateTomcat',updateInfo );
      persistence.saveDesktopItemToFile(this.item);
    }
  },
  mounted : function() {
    this.updateVersionTaskId = version.buildTaskId(this.tomcat);
  }
};
