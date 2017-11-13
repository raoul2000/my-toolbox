
module.exports = {
  props: ['message'],
  data : function(){
    return {
      disableAction : false
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

  }
};
