const validate  = require('validator');
const notify    = require('../../../../../../service/notification');

module.exports = {
  props : ['webapp','ip','port','webappsPath'],
  components : {
    "inlineInput"    : require('../../../../../../lib/component/inline-input'),
  },
  data : function(){
    return {
      validation : {
        "name"   : true,
        "path"   : true
      }
    };
  },
  template: require('./main.html'),
  computed : {
    webappURL : function() {
      return `http://${this.ip}:${this.port}${this.webapp.path}`;
    }
  },
  methods : {
    changeValue : function(arg) {
      if( arg.name === "webapp-path") {
        if(  validate.isEmpty(arg.value)) {
          this.validation.path = false;
        } else if( this.webappsPath.indexOf(arg.value) !== -1) {
          this.validation.path = false;
          notify(`The path <b>${arg.value}</b> is already in use`,'error','error');
        } else {
          this.validation.path = true;
        }
      }
      // webapp.name is always valid (even if empty)
    }
  },
   mounted : function(){
     console.log("webapp mount");
   }
};
