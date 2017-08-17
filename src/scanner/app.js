var remote = require('electron').remote;
var fs = require('fs');
var checkSSHConnection = require('./lib/check-connection').checkConnection;
var getEntities = require('./lib/entities').getEntities;
var extractTomcatIds = require('./lib/tc-identifier').extractTomcatIds;
var extractInstallDir = require('./lib/tc-install-dir').extractInstallDir;
var allSettledInSequence = require('./lib/promise').allSettledInSequence;

//Vue.component('url-list', require('./list/main'));

function reflect(item){
    return item.then(
      function(v){ return {result :v, status: "OK"}},
      function(e){ return {error :e,  status: "FAIL"}}
    );
}

var app = new Vue({
  el: '#app',
  data: {
    ssh : {
      host : '',
      port : 22,
      username : '',
      password : '',
      readyTimeout : 5000
    },
    connectionOk : true,
    action : null,
    entities : {}
  },
  computed : {
    canStartScan : function(){
      return this.connectionOk === true && this.action === null && this.ssh.host.length > 0 && this.ssh.username.length > 0;
    },
    canTestConnection : function(){
      return this.action === null && this.ssh.host.length > 0 && this.ssh.username.length > 0;
    }
  },
  methods : {
    startScan : function(){
      var self = this;
      getEntities(this.ssh)
      .then( result => {
        console.log(result);
        var tcIds = extractTomcatIds(result);
        console.log(tcIds);

        var promises = tcIds.filter(function(item){
          // only keep a reduced set of tomcat ids for tests purposes
          return item === "inout" || item === "core" ;
          //return true;
        }).map( tcId =>  extractInstallDir(self.ssh, tcId) );

        // TODO : implement promises in sequence
        //return allSettledInSequence(promises);
        return Promise.all(promises.map(reflect)).then( results => results );
      })
      .then( tcInstallDirs => {
        console.log("tcInstallDirs = ",tcInstallDirs);
      });
    },
    testConnection : function() {
      this.action = "test-connection";
      this.connectionOk = null;
      checkSSHConnection(this.ssh)
      .then( success => {
        this.connectionOk = true;
        this.action = null;
      })
      .catch(error => {
        this.action = null;
        this.connectionOk = false;
      });
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
