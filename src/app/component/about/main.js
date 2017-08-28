

module.exports = Vue.component('modal-about',  {
  data : function(){
    return {
      message : "message from list",
    };
  },
  template: require('./main.html'),
  // life cycle hook
  mounted : function(){
    var self = this;
    $('#modal').modal("show").one('hidden.bs.modal', function (e) {
      self.$emit('close');
    });
  }
});
