var electron = require('electron');
var remote = require('electron').remote;
var slug = require('slug');
var fs = require('fs');
const store    = require('../../service/store/store');
var checkSSHConnection = require('../../lib/ssh/check-connection').checkConnection;

module.exports = {
  data : function(){
    return {
      "connectionOk" : true,
      "action"       : null,
      "server"         : {
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
    saveServer : function() {
      var self = this;
      var defaultFilename = slug(this.server.name).concat('.json');

      remote.dialog.showSaveDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select Item",
          "defaultPath" : defaultFilename
        },
        function(filename) {
          console.log(filename);
          if( filename ) {
            fs.writeFile(filename, JSON.stringify(self.server, null, 2) , 'utf-8', (err) => {
              if(err) {
                notify('failed to save','error','error');
                console.error(err);
              }
            });
          }
        }
      );
    },
    testConnection : function() {
      this.action = "test-connection";
      this.connectionOk = null;
      checkSSHConnection(this.server.ssh)
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
  computed : {
    canSaveServer : function() {
      return this.action === null
        && this.server.name.length > 0;
    },
    canTestConnection : function(){
      return this.action === null
        && this.server.ssh.host.length > 0
        && this.server.ssh.username.length > 0;
    }
  }
};
