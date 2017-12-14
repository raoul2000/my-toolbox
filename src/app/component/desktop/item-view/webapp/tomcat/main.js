const validate = require('validator');
const notify   = require('../../../../../service/notification');
const helper   = require('../../../../../lib/lib').helper;

module.exports = {
  props : ['item', 'tomcat'],
  components : {
    "webapp"      : require('./webapp/main'),
    "inlineInput" : require('../../../../../lib/component/inline-input'),
  },
  data : function(){
    return {
      validation : {
        "id"     : true,
        "port"   : true
      }
    };
  },
  template: require('./main.html'),
  methods : {
    addWebapp : function() {
      console.log('addWebapp');
      this.$store.commit('addWebapp', {
        "item"   : this.item,
        "tomcat" : this.tomcat,
        "webapp" : {
          "_id"    : helper.generateUUID(),
          "name"   : "",
          "path"   : "/"
        }
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
          notify(`A Tomcat instance with the id <b>${arg.value}</b> is already in use`,'error','error');
        } else {
          this.validation.id = true;
        }
      } else if( arg.name === "port") {
        this.validation.port = false;
        if( ! validate.isInt(arg.value+'',{ gt : 0}) ) {
          notify("The PORT number should be an integer value",'error','error');
        } else if( ! this.isUniqueTomcatPort(arg.value)) {
          notify(`The port <b>${arg.value}</b> is already in use`,'error','error');
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
    }
  }
};
