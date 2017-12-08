
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
     // find the desktop item in the store
     this.item = this.$store.getters.desktopItemByIndex(desktopItemIndex);
   }
};
