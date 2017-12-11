
module.exports = {
  props : ['tomcat'],
  data : function(){
    return {
      "tc" : this.tomcat
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
     console.log("tomcat mount");
   }
};
