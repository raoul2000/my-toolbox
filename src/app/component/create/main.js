var electron = require('electron');
var remote = require('electron').remote;
var slug = require('slug');
var fs = require('fs');
const store    = require('../../service/store/store');
var checkSSHConnection = require('../../service/ssh/check-connection').checkConnection;



var scan = require('./lib/scanner').scan;
var extractTomcatProperties = require('./lib/tc-scan/properties').extractTomcatProperties;
var tcConfig = require('./lib/tc-scan/config');
var getEntities = require('./lib/entities').getEntities;
var descriptor = require('./lib/tc-scan/descriptor');
var matcher = require('./lib/servlet-matcher');
var waterfall = require("promise-waterfall");


module.exports = {
  data : function(){
    return {
      ssh : {
        host         : '10.25.7.131',
        port         : 22,
        username     : 'meth01',
        password     : 'meth01',
        readyTimeout : 5000
      },
      connectionOk : true,
      action : null,
      logEntries : [],
      scan : {
        "name"   : '',
        "entity" : [],
        "tomcat" : []
      }
    };
  },
  template: require('./main.html'),
  methods : {
    saveScanResult : function() {
      var self = this;
      var defaultFilename = slug(this.scan.name).concat('.json');

      remote.dialog.showSaveDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select Item",
          "defaultPath" : defaultFilename
        },
        function(filename) {
          console.log(filename);
          if( filename ) {
            fs.writeFile(filename, JSON.stringify(self.scan, null, 2) , 'utf-8', (err) => {
              // TODO : manage ERROR here !
              if(err) console.error(err);
            });
          }
        }
      );
    },
    openTomcatManager  : function(tomcat) {
      var managerURL =  `http://${this.ssh.host}:${tomcat.conf.connector.port}/manager/html`;
      console.info("opening Tomcat Manager : "+managerURL);
      electron.shell.openItem(managerURL);
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
    },
    startScan : function(simulationMode){
      this.action = "start-scan";
      if(simulationMode) {
        console.log("startScan in SIMULATION mode");
        var result = JSON.parse(fs.readFileSync(__dirname+'/data-2.json', 'utf8'));
        this.scan.entity = Object.keys(result.entities).map( prop => {
          return {name : prop, "value" : result.entities[prop]};
        });
        this.scan.tomcat = result.tomcat;
        this.action = null ;
      } else {
        var self = this;
        scan(this.ssh)
        .then( result => {
          console.log(result);
          fs.writeFile(__dirname+'/data-2.json', JSON.stringify(result, null, 2) , 'utf-8', (err) => {
            if(err) console.error(err);
          });
          //entitiesAsObject = result.entities;
          self.scan.entity = Object.keys(result.entities).map( prop => {
            return {name : prop, "value" : result.entities[prop]};
          });
          self.scan.tomcat = result.tomcat;
          self.action = null ;
          return Promise.resolve(true);
        })
        .catch( err => {
          console.error(err);
          self.action = null ;
        });
      }
    }
  },
  computed : {
    canSaveScanResult : function() {
      return this.action === null
        && this.scan.entity.length > 0;
    },
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
  // life cycle hook
  beforeCreate : function(){
  },
  mounted : function(){
    //this.loadOptionsFromUrl();
  },
	created: function () {
  },
	beforeUpdate: function() {
		console.log('beforeUpdate');
	},
	updated : function() {
		console.log('updated: name is = '+this.name);
	}
};
