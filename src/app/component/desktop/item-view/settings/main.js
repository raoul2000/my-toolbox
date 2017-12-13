'use strict';

const validate         = require('validator');
var fs                 = require('fs');
var path               = require('path');
const config           = require('../../../../service/config');
var checkSSHConnection = require('../../../../lib/ssh/check-connection').checkConnection;

module.exports = {
  components : {
    "inlineInput"    : require('../../../../lib/component/inline-input'),
    "inlineTextarea" : require('../../../../lib/component/inline-textarea')
  },
  template: require('./main.html'),
  data : function(){
    return {
      action       : null, // 'test-connection'
      connectionOk : true,
      data         : null,
      filename     : "",
      validation : {
        "host"     : true,
        "username" : true,
        "password" : true,
        "port"     : true,
        "notes"    : true
      }
    };
  },
  computed : {
    canTestConnection : function(){
      return this.action === null
        && this.data.ssh.host.length > 0
        && this.data.ssh.username.length > 0
        && this.data.ssh.password.length > 0;
    }
  },
  methods : {
    testConnection : function() {
      this.action = "test-connection";
      this.connectionOk = null;
      checkSSHConnection(this.data.ssh)
      .then( success => {
        this.connectionOk = true;
        this.action = null;
      })
      .catch(error => {
        this.action = null;
        this.connectionOk = false;
      });
    },
    /**
     * Update the JSON file the current desktop item has been loaded from.
     * This method is called after successfull value change (SSH or notes)
     */
    updateDesktopItemFile : function() {
      let filePath = path.join(config.store.get("ctdbFolderPath"), this.filename);
      fs.writeFile(filePath, JSON.stringify(this.data, null, 2) , 'utf-8', (err) => {
        if(err) {
          notify('failed to save changes to file','error','error');
          console.error(err);
        }
      });
    },
    /**
     * Handle Notes update : updtae the store and the file
     */
    changeNotesValue : function(arg) {
      store.commit('updateDesktopItem', {
        id          : this.data.id,
        updateWith  : {
          notes  : arg.value
        }
      });
      this.updateDesktopItemFile(); // update the file
    },
    /**
     * Handle SSH settings update : update the store and the file.
     * Note that validation is not blocking the save operation.
     */
    changeSSHValue : function(arg){
      if( arg.name === "host") {
        // host is actually IP
        // TODO : change property name from 'host' to 'ip'
        this.validation[arg.name] = validate.isIP(arg.value);
      } else if( arg.name === "port") {
        // port is not required (default is 22) but if set, it must  be valid
        this.validation[arg.name] = validate.isEmpty(arg.value) ? true : validate.isInt(arg.value+'',{ gt : 0});
      }

      // update store and file is ALWAYS done (even if validation fails)
      let updateData =  {
        id         : this.data.id,
        selector   : 'ssh',
        updateWith : {}
      };
      updateData.updateWith[arg.name] = arg.value;
      store.commit('updateDesktopItem',updateData);
      this.updateDesktopItemFile(); // update the file
    }
  },

  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
  mounted : function(){
    let itemId = this.$route.params.id;
    // find the desktop item in the store
    let dkItem = this.$store.getters.desktopItemById(itemId);
    if( dkItem ) {
      this.data     = dkItem.data;
      this.filename = dkItem.filename;
    } else {
      console.warn("fail to load item : id = "+itemId);
    }
  }
};
