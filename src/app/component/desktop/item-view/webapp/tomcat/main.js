const validate         = require('validator');
const notify    = require('../../../../../service/notification');

module.exports = {
  props : ['tomcat','ip', 'tomcatIds'],
  components : {
    "webapp"    : require('./webapp/main'),
    "inlineInput"    : require('../../../../../lib/component/inline-input'),
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
    changeValue : function(arg) {
      if( arg.name === "tomcat-id") {
        if(  validate.isEmpty(arg.value)) {
          this.validation.id = false;
        } else if( this.tomcatIds.indexOf(arg.value) !== -1) {
          this.validation.id = false;
          notify(`The id <b>${arg.value}</b> is already in use`,'error','error');
        } else {
          this.validation.id = true;
        }
      } else if( arg.name === "tomcat-port") {
        this.validation.port = validate.isInt(arg.value+'',{ gt : 0});
      }
    }
  },
  computed : {
    webappsPath : function() {
      return this.tomcat.webapp.map( webapp => webapp.path);
    }
  },
  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
   mounted : function(){
     console.log("tomcat mount");
   }
};
