var remote = require('electron').remote;
var fs = require('fs');

Vue.component('url-list', require('./list/main'));

var app = new Vue({
  el: '#app',
  data: {
    disableAction : false,
    actionCompletedCount : 0,
    action : null,
    urlList : {
      'name' : 'URL set 1',
      'url'  : []
    }
  },
  methods : {
    testAllUrl : function() {
      this.disableAction = true;
      this.actionCompletedCount = 0;
      this.action = "test-all";
    },
    versionAllUrl : function() {
      this.disableAction = true;
      this.actionCompletedCount = 0;
      this.action = "version-all";
    },
    actionCompleted : function(success) {
      console.log("actionCompleted : ",success);
      if( this.action ) {
        this.actionCompletedCount++;

        if( this.actionCompletedCount === this.urlList.url.length ) {
          this.action = null;
          this.actionCompletedCount = 0;
          this.disableAction = false;
        }
      }
    },
    loadUrlList : function(){
      var self = this;
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select URL list",
          "properties" : [ 'openFile']
        },
        function(filename) {
          console.log(filename);
          if(filename && filename.length === 1) {
            self.urlList = JSON.parse(fs.readFileSync(filename[0], 'utf8'));
          }
        }
      );
    }
  },
	// life cycle hook
	created: function () {
    // `this` est une référence à l'instance de vm
    console.log('created : message is: ' );
  },
	beforeUpdate: function() {
		console.log('beforeUpdate');
	},
	updated : function() {
		console.log('updated: name is = ');
	} // more hooks available - see https://fr.vuejs.org/v2/guide/instance.html#Diagramme-du-cycle-de-vie
});
