
module.exports = {
  data : function(){
    return {
      message : "message from list",
      name : '',
      todos: [
        { text: 'Apprendre JavaScript' },
        { text: 'Apprendre Vue' },
        { text: 'Créer quelque chose de génial' }
      ],
      items: [
        { name: 'blue', options : [ 'b1', 'b2', 'b3']},
        { name: 'green', options : [ 'g1', 'g2', 'g3'] },
        { name: 'yellow', options : [ 'y1', 'y2', 'y3'] }
      ],
      options0 : [],
      selected : ''
    };
  },
  template: require('./main.html'),
  methods : {
    optionSelected : function(value) {
      console.log('optionSelected : ', value);
      this.selected = value;
    }
  },
  // life cycle hook
  beforeCreate : function(){
  },
  mounted : function(){
    //this.loadOptionsFromUrl();
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
};
