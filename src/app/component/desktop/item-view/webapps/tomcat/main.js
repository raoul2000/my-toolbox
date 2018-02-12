const validate = require('validator');
const notify   = require('../../../../../service/notification');
const helper   = require('../../../../../lib/lib').helper;
var persistence = require('../../../../../lib/lib').persistence;

module.exports = {
  props : ['item', 'tomcat', 'expandTomcat', 'expandWebapp', 'filter'],
  components : {
    "webapp"      : require('./webapp/main'),
    "inlineInput" : require('../../../../../lib/component/inline-input'),
  },
  data : function(){
    return {
      validation : {
        "id"     : true,
        "port"   : true,
        "version": true
      },
      expanded : this.expandTomcat
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
  }
};
