const validate = require('validator');
const notify   = require('../../../../../service/notification');
const helper   = require('../../../../../lib/lib').helper;
var persistence = require('../../../../../service/persistence');
const version = require('../../../../../service/version/tomcat');

const shell = require('electron').shell;

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
    },
    /**
     * Build the id for the task in charge of updating tomcat version
     */
    updateVersionTaskId_toDelete : function() {
      return version.buildTaskId(this.tomcat);
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
     * Start the Tomcat version update task
     */
    refreshVersion_fake : function(){
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
        // update the tomcat 'version' property
        //
        // NOTE : the fact to update to stored tomcat.version will cause
        // a refresh and as this property is bound to the inline-input 'initialValue'
        // and the inline-input component will perform a foreceUpdate. The validation of
        // the version value that was obtained is done by this component (just like for a
        // user modification)

        self.$store.commit('updateTomcat',{
          "item"       : self.item,
          "tomcat"     : self.tomcat,
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
     * Open the browser at the address of thiss tomcat manager
     */
    openTomcatManager : function(url) {
      shell.openExternal(this.tomcatManagerURL);
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
      (new PNotify({
          title: 'Confirmation Needed',
          text: `Are you sure you want to delete the tomcat <code>${self.tomcat.id}</code> and all its webapps ?`,
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
      if( arg.name === "id") {
        if(  validate.isEmpty(arg.value)) {
          this.validation.id = false;
        } else if( ! this.isUniqueTomcatId(arg.value)) {
          this.validation.id = false;
          notify(`A Tomcat instance with the id <b>${arg.value}</b> is already in use`,'warning','warning');
        } else {
          this.validation.id = true;
        }
      } else if( arg.name === "port") {
        this.validation.port = false;
        if( ! validate.isInt(arg.value+'',{ gt : 0}) ) {
          notify("The PORT number should be an integer value",'warning','warning');
        } else if( ! this.isUniqueTomcatPort(arg.value)) {
          notify(`The port <b>${arg.value}</b> is already in use`,'warning','warning');
        } else {
          this.validation.port = true;
          arg.value = parseInt(arg.value);
        }
      } else if( arg.name === 'version') {
        this.validation.version = true;
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
