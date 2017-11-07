var electron = require('electron');
var remote = require('electron').remote;
var slug = require('slug');
var fs = require('fs');
const store    = require('../../service/store/store');
var checkSSHConnection = require('../../lib/ssh/check-connection').checkConnection;
var scan = require('./lib/scanner').scan;
var matcher = require('./lib/servlet-matcher');

module.exports = {
  data : function(){
    return {
      "connectionOk" : true,
      "action"       : null,
      "logEntries"   : [],
      "scan"         : {
        "name"   : '',
        "ssh"    : {
          "host"         : '10.25.7.131',
          "port"         : 22,
          "username"     : 'meth01',
          "password"     : 'meth01',
          "readyTimeout" : 50000
        },
        "entity" : [],
        "tomcat" : []
      }
    };
  },
  template: require('./main.html'),
  methods : {
    identifyServlet : function() {
      matcher.identifyServlets(this.scan, store.webappDefinition);
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
    /**
     * Create and opens a link to the tomcat manager page
     * @param  {Object} tomcat the tomcat object
     */
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
      var self = this;
      if(false) { // for dev only
        console.log("startScan in SIMULATION mode");
        var result = JSON.parse(fs.readFileSync(__dirname+'/data-2.json', 'utf8'));
        /*
        this.scan.entity = Object.keys(result.entities).map( prop => {
          return {name : prop, "value" : result.entities[prop]};
        });
        */
       this.scan.entity = result.entity;
        this.scan.tomcat = result.tomcat;
        matcher.identifyServlets(self.scan, store.state.webappDefinition);

        this.action = null ;
      } else {

        scan(this.scan.ssh)
        .then( result => {
          console.log(result);

          //entitiesAsObject = result.entities;
          self.scan.entity = Object.keys(result.entities).map( prop => {
            return {name : prop, "value" : result.entities[prop]};
          });
          self.scan.tomcat = result.tomcat;
          // copy SSH
          this.scan.ssh = this.scan.ssh;
          matcher.identifyServlets(self.scan, store.state.webappDefinition);
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
  }
};
