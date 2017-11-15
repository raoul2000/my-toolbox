
module.exports = {
  props: ['message'],
  data : function(){
    return {
      data : null,
      filename : ""
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
    console.log('mounted');
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
