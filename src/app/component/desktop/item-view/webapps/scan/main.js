const store     = require('../../../../../service/store/store');

module.exports = Vue.component('modal-tc-scan',  {
  props : ['item'],
  data : function(){
    return {
      message : "message from list",
      step    : ""
    };
  },
  template: require('./main.html'),
  // life cycle hook
  mounted : function(){
    var self = this;
    //this.$store
    store.tcScan.getters.taskById(this.item.data._id);
    //this.task =
    // trigger modal display attaching event handler to close
    $('#modal-scan-tomcat').modal("show").one('hidden.bs.modal', function (e) {
      self.$emit('close');
    });
  }
});
