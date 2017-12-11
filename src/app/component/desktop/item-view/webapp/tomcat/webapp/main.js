
module.exports = {
  props : ['webapp','ip','port'],
  data : function(){
    return {};
  },
  template: require('./main.html'),
  methods : {

  },

   mounted : function(){
     console.log("webapp mount");
   }
};
