
module.exports = {
  data : function(){
    return {
      message : "message from list",
    };
  },
  template: require('./main.html'),
  methods : {
    onCancel : function() {
      this.$router.push('/desktop');
    }
  }
};
