var electron = require('electron');
var remote = require('electron').remote;
var slug = require('slug');
var path = require('path');
var fs = require('fs');
const store    = require('../../service/store/store');
const config    = require('../../service/config');

var checkSSHConnection = require('../../lib/ssh/check-connection').checkConnection;

module.exports = {
  data : function(){
    return {
      "connectionOk" : true,
      "action"       : null,
      "server"         : {
        "name"   : '',
        "notes"  : '',
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

      var defaultFilename = path.join(
        config.getCTDBPath(),
        slug(this.server.name).concat('.json')
      );
      console.log('saving to ', defaultFilename);

      remote.dialog.showSaveDialog(
        remote.getCurrentWindow(),  // is modal on the main window
        {
          "title"      : "Select Item",
          "defaultPath" : defaultFilename
        },
        function(filename) {
          console.log(filename);
          if( filename ) {
            let ctdbBasePath = config.store.get("ctdbFolderPath");
            // check if this file is under the CTBD base folder
            var relativeFilePath = filename.replace(ctdbBasePath,'');
            if(relativeFilePath === filename) {
              // TODO : wee how to highlight the existing item (css animate ?)
              notify('It is not permitted to save an item out of the base folder','error','Error');
            } else {
              fs.writeFile(filename, JSON.stringify(self.server, null, 2) , 'utf-8', (err) => {
                if(err) {
                  notify('failed to save','error','error');
                  console.error(err);
                } else {
                  notify(`Saved to <b>${relativeFilePath}</b>` ,'success','Success');
                  config.store.set('recent.ctdbPath',path.dirname(filename));
                }
              });
            }
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
