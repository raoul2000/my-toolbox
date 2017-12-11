
module.exports = {
  props : ['tomcat','ip'],
  components : {
    "webapp"    : require('./webapp/main')
  },
  data : function(){
    return {};
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
