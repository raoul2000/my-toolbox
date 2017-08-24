var remote = require('electron').remote;
var fs = require('fs');
const store    = require('../../service/store/store');
const notify   = require('../../service/notification');

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
      options0 : [],
      selected : '',
      items2 : [

      ]
    };
  },
  template: require('./main.html'),
  computed : {
    items : function(){
      return store.state.desktop;
    }
  },
  methods : {
    createItem : function() {
      this.$router.push('/create');
    },
    view : function(index) {
      this.$router.push({ path: '/view', query: { "index": index }});

    },
    removeFromDesktop1 : function(item) {
      store.commit('removeFromDesktop',item);
    },
    removeFromDesktop : function(index) {
      store.commit('removeFromDesktop',index);
    },
    openFolder : function() {
      var self = this;
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select Item",
          "properties" : [ 'openFile', 'multiSelections']
        },
        function(filenames) {
          console.log(filenames);
          if( Array.isArray(filenames) ) {
            filenames.forEach(file => {
              // TODO : only add o desktop if not already there - existing item
              // could by highlighted by CSS (flash ?)
              if( store.getters.desktopItemByFilename(file) !== undefined) {
                notify('The item is already included in the desktop','warning','warning');
              } else {
                store.commit('addToDesktop',{
                  "filename" : file,
                  "data" : JSON.parse(fs.readFileSync(file, 'utf8'))
                });
              }
            });
          }
        }
      );
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
