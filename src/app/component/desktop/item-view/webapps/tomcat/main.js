const validate = require('validator');
const notify   = require('../../../../../service/notification');
const helper   = require('../../../../../lib/lib').helper;
var persistence = require('../../../../../lib/lib').persistence;

module.exports = {
  props : ['item', 'tomcat','expanded'],
  components : {
    "webapp"      : require('./webapp/main'),
    "inlineInput" : require('../../../../../lib/component/inline-input'),
  },
  data : function(){
    return {
      validation : {
        "id"     : true,
        "port"   : true
      },
      showWebapp : this.expanded
    };
  },
  template: require('./main.html'),
  computed : {
    tomcatManagerURL : function() {
        return `http://${this.item.data.ssh.host}:${this.tomcat.port}/manager/html`;
    }
  },
  watch : {
    expanded : function(){
      console.log('expanded');
      //this.showWebapp = ! this.showWebapp;
    }
  },
  methods : {
    toggleButtonClass : function() {
      if( this.expanded ) {
        return ["glyphicon", "glyphicon-menu-down"];
      } else {
        return ["glyphicon", "glyphicon-menu-right"];
      }
    },
    toggleWebappView : function() {

      let elDiv = document.getElementById(this.tomcat._id);
      elDiv.classList.toggle('collapse-tomcat');

      //this.expanded = ! this.expanded;
    },
    addWebapp : function() {
      console.log('addWebapp');
      this.$store.commit('addWebapp', {
        "item"   : this.item,
        "tomcat" : this.tomcat,
        "webapp" : {
          "_id"    : helper.generateUUID(),
          "name"   : "",
          "path"   : "/",
          "refId"  : null // refer to a webapp in the definition list
        }
      });
      persistence.saveDesktopnItemToFile(this.item);
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
        persistence.saveDesktopnItemToFile(self.item);
      });
    },
    isUniqueTomcatId : function(id) {
      return this.item.data.tomcats.findIndex( tc => tc.id === id) === -1 ;
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
      persistence.saveDesktopnItemToFile(this.item);
    }
  }
};
