
const validate = require('../../../../lib/validation');

module.exports = {
  components : {
    "inlineInput" : require('../../../../lib/component/inline-input')
  },
  data : function(){
    return {
      data : null,
      filename : "",
      validation : {
        "host"     : true,
        "username" : true,
        "password" : true,
        "port"     : true,
        "notes"    : true
      }
    };
  },
  template: require('./main.html'),
  methods : {
    changeValue : function(arg){
      console.log('changeValue',arg);
      if( arg.name === "host") {
        this.validation[arg.name] = validate.isIP(arg.value);
      } else if( arg.name === "username") {
        this.validation[arg.name] = validate.isNotEmptyString(arg.value);
      }
    }
  },

  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
  mounted : function(){
    let desktopItemIndex = this.$route.params.id;
    if( desktopItemIndex === -1 ) {
      console.error("missing desktopn item index");
      return;
    }
    this.desktopItemIndex = this.$route.params.id;
    // find the desktop item in the store
    let dkItem = this.$store.getters.desktopItemByIndex(desktopItemIndex);
    this.data = dkItem.data;
    this.filename = dkItem.filename;
  }
};
