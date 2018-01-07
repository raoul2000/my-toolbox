

module.exports = Vue.component('modal-tc-scan',  {
  props : ['item'],
  data : function(){
    return {
      message : "message from list",
    };
  },
  template: require('./main.html'),
  // life cycle hook
  mounted : function(){
    var self = this;
    // trigger modal display attaching event handler to close
    $('#modal-scan-tomcat').modal("show").one('hidden.bs.modal', function (e) {
      self.$emit('close');
    });
  }
});
