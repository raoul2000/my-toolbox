
module.exports = {
  components : {
    "tomcat"    : require('./tomcat/main')
  },
  data : function(){
    return {
      disableAction : false,
      item : null
    };
  },
  template: require('./main.html'),
  methods : {
    AddTomcat : function() {
      console.log('addTomcat');
      //this.$store.
    }
  },
  computed : {
    tomcatIds : function() {
      return this.item.data.tomcat.map( tomcat => tomcat.id);
    }
  },
  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
   mounted : function(){
     // find the desktop item in the store
     this.item = this.$store.getters.desktopItemById(this.$route.params.id);
   }
};
