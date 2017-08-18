var remote = require('electron').remote;
var fs = require('fs');
var checkSSHConnection = require('./lib/check-connection').checkConnection;
var scan = require('./lib/scanner').scan;
var extractTomcatProperties = require('./lib/tc-scan/properties').extractTomcatProperties;
var tcConfig = require('./lib/tc-scan/config');
var tcContext = require('./lib/tc-scan/context');
var getEntities = require('./lib/entities').getEntities;
var descriptor = require('./lib/tc-scan/descriptor');
const NodeSSH = require('node-ssh');

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
      host         : '10.25.7.131',
      port         : 22,
      username     : 'meth01',
      password     : 'meth01',
      readyTimeout : 5000
    },
    connectionOk : true,
    action : null
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
    test1 : function() {
      let ssh = new NodeSSH();
      return ssh.connect(this.ssh)
      .then( () => getEntities(ssh))
      .then( (entities) => descriptor.getAllServlet(ssh, "/methode/meth01/methode-servlets/adorder/WEB-INF/web.xml", entities))
      .then( result => console.log(result))
      //.then( (entities) => tcContext.getContextsFromTomcatDir(ssh, "/methode/meth01/tomcat-inout", entities))
      //.then( result => console.log(result))


      //.then( (entities) => tcConfig.getDOM(ssh, "/methode/meth01/tomcat-inout", entities))
      //.then( result => console.log(result))
      //.then( () => extractTomcatProperties(ssh, "/methode/meth01/tomcat-inout"))
      //.then( result => console.log(result))
      .catch(err => {
        console.error(err);
      });
    },
    startScan : function(){
      scan(this.ssh)
      .then(  result => {
        console.log(result);
      })
      .catch( err => {
        console.error(err);
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
