
console.log('loaded modal-about');
module.exports = Vue.component('modal-about',  {

  data : function(){
    return {
      message : "message from list",
    };
  },
  template: require('./main.html'),
  methods : {
    navigate : function() {
      console.log('navigate');
      this.$router.push('/bar');
    },
    optionSelected : function(value) {
      console.log('optionSelected : ', value);
      this.selected = value;
    }
  },
  // life cycle hook
  beforeCreate : function(){
  },
  mounted : function(){
    console.log('mounted');
    var self = this;
    $('#modal').modal("show").one('hidden.bs.modal', function (e) {
      console.log("closing about");
      self.$emit('close');
    });
  },
	created: function () {
    // `this` est une référence à l'instance de vm
    console.log('created : message is: ' + this.message);
  },
	beforeUpdate: function() {
		console.log('beforeUpdate');
	},
	updated : function() {
		console.log('updated: name is = '+this.name);
	}
});
