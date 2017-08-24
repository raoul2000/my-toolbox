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

var servletRef = {
  "servlet1" : {
    "id" : "servlet1",
    "name" : "Servlet 1",
    "url" : {
      "release" : "http://s1/release",
      "snapshot": "http://s1/release",
      "changes" : "http://s1/changes",
      "doc"     : "http://s1/doc"
    },
    "class" : ['dummyCheckin', 'checkin.CheckinServlet']
  },
  "servlet2" : {
    "id" : "servlet2",
    "name" : "Servlet 2",
    "url" : {
      "release" : "http://s2/release",
      "snapshot": "http://s2/release",
      "changes" : "http://s2/changes",
      "doc"     : "http://s2/doc"
    },
    "class" : ['AdminServlet', 'ddd']
  }
};

module.exports = {
  data : function(){
    return {
      connectionOk : true,
      action : null,
      logEntries : [],
      scan : {
        "name"   : '',
        "ssh"    : {
          "host"         : '10.25.7.131',
          "port"         : 22,
          "username"     : 'meth01',
          "password"     : 'meth01',
          "readyTimeout" : 5000
        },
        "entity" : [],
        "tomcat" : []
      }
    };
  },
  template: require('./main.html'),
  methods : {
    identifyServlet : function() {
      matcher.identifyServlets(this.scan, servletRef);
    },
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
      var managerURL =  `http://${this.scan.ssh.host}:${tomcat.conf.connector.port}/manager/html`;
      console.info("opening Tomcat Manager : "+managerURL);
      electron.shell.openItem(managerURL);
    },
    testConnection : function() {
      this.action = "test-connection";
      this.connectionOk = null;
      checkSSHConnection(this.scan.ssh)
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
      if(false) {
        console.log("startScan in SIMULATION mode");
        var result = JSON.parse(fs.readFileSync(__dirname+'/data-2.json', 'utf8'));
        this.scan.entity = Object.keys(result.entities).map( prop => {
          return {name : prop, "value" : result.entities[prop]};
        });
        this.scan.tomcat = result.tomcat;
        this.identifyServlet();

        this.action = null ;
      } else {
        var self = this;
        scan(this.scan.ssh)
        .then( result => {
          console.log(result);
          /*
          fs.writeFile(__dirname+'/data-2.json', JSON.stringify(result, null, 2) , 'utf-8', (err) => {
            if(err) console.error(err);
          });
          */
          //entitiesAsObject = result.entities;
          self.scan.entity = Object.keys(result.entities).map( prop => {
            return {name : prop, "value" : result.entities[prop]};
          });
          self.scan.tomcat = result.tomcat;
          // copy SSH
          this.scan.ssh = this.scan.ssh;
          self.action = null;
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
        && this.scan.ssh.host.length > 0
        && this.scan.ssh.username.length > 0;
    },
    canTestConnection : function(){
      return this.action === null
        && this.scan.ssh.host.length > 0
        && this.scan.ssh.username.length > 0;
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
