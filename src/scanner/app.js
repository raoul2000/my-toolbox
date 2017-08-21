var remote = require('electron').remote;
var electron = require('electron');
var fs = require('fs');
var checkSSHConnection = require('./lib/check-connection').checkConnection;
var scan = require('./lib/scanner').scan;
var extractTomcatProperties = require('./lib/tc-scan/properties').extractTomcatProperties;
var tcConfig = require('./lib/tc-scan/config');
var getEntities = require('./lib/entities').getEntities;
var descriptor = require('./lib/tc-scan/descriptor');
var waterfall = require("promise-waterfall");
const NodeSSH = require('node-ssh');

//Vue.component('url-list', require('./list/main'));

function reflect(item){
    return item.then(
      function(v){ return {result :v, status: "OK"}},
      function(e){ return {error :e,  status: "FAIL"}}
    );
}
var entitiesAsObject = {};

var app = new Vue({
  el: '#app',
  data: {
    ssh : {
      host         : '172.24.150.2',
      port         : 22,
      username     : 'meth01',
      password     : 'meth01',
      readyTimeout : 5000
    },
    connectionOk : true,
    action : null,
    logEntries : [],
    scan : {
      "entity" : [],
      "tomcat" : []
    }
  },
  computed : {
    canStartScan : function(){
      return this.connectionOk === true
        && this.action === null
        && this.ssh.host.length > 0
        && this.ssh.username.length > 0;
    },
    canTestConnection : function(){
      return this.action === null
        && this.ssh.host.length > 0
        && this.ssh.username.length > 0;
    }
  },
  methods : {
    openTomcatManager  : function(tomcat) {
      var managerURL =  `http://${this.ssh.host}:${tomcat.conf.connector.port}/manager/html`;
      console.info("opening Tomcat Manager : "+managerURL);
      electron.shell.openItem(managerURL);
    },
    test1 : function() {
      var self = this;
      var xmlEntities = {};

      let ssh = new NodeSSH();
      return ssh.connect(this.ssh)
      .then( () => {
        self.logEntries.push({ text : "connected"});
        return getEntities(ssh)})
      .then( (entities) => {
        xmlEntities = entities;
        var entityArray = Object.keys(entities).map( prop => {
          return {name : prop, "value" : entities[prop]};
        });

        return tcConfig.getConfig(ssh,"/methode/meth01/tomcat-core",entities);
/*        console.log(entities);
        self.logEntries.push({ text : "entities extracted : "+entityArray.length});
        return descriptor.getAllServlet(ssh, "/methode/meth01/methode-servlets/adorder/WEB-INF/web.xml", entities);
*/
      })
      .then( result => console.log(result))
      .catch(err => {
        console.error(err);
      });
    },
    startScan : function(){
      var self = this;
      scan(this.ssh)
      .then( result => {
        console.log(result);
        fs.writeFile(__dirname+'/data.json', JSON.stringify(result, null, 2) , 'utf-8', (err) => {
          if(err) console.error(err);
        });
        entitiesAsObject = result.entities;
        self.scan.entity = Object.keys(result.entities).map( prop => {
          return {name : prop, "value" : result.entities[prop]};
        });
        self.scan.tomcat = result.tomcat;
        return Promise.resolve(true);
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
