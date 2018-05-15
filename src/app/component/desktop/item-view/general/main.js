'use strict';

const validate         = require('validator');
var fs                 = require('fs');
var path               = require('path');
const config           = require('../../../../service/config');
var persistence        = require('../../../../service/persistence');
var service            = require('../../../../service/service').service;
var checkSSHConnection2            = require('../../../../service/ssh/check-connection');

module.exports = {
  components : {
    "inlineInput"    : require('../../../../lib/component/inline-input'),
    "inlineTextarea" : require('../../../../lib/component/inline-textarea'),
    "autocomplete"   : require('../../../../lib/component/auto-complete')
  },
  template: require('./main.html'),
  data : function(){
    return {
      connectionOk : null,
      item         : null,
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
    /**
     * User can test SSH connection (button enabled) if :
     * - no check task is in progress
     * - host is not empty
     * - username is nopt empty
     * If password is empty it will be prompted.
     */
    canTestConnection : function(){
      let task = this.checkSSHConnectionTask;
      return ( ( task && task.status !== "BUSY") || !task)
        && this.item.data.ssh.username.length !== 0
        && this.item.data.ssh.host.length > 0;
    },
    /**
     * Returns the current SSH connection check task, or 'undefined' of no such
     * task exists in the store.
     */
    checkSSHConnectionTask : function(){
      return  this.$store.getters['tmptask/taskById'](this.checkSSHConnectionTaskId);
    },
    /**
     * Create the task ID. As it depends on the host/username, it must be computed
     * and cannot be assigned on 'mounted'
     */
    checkSSHConnectionTaskId : function() {
      return checkSSHConnection2.createTaskId(this.item.data.ssh);
    },
    /**
     * SSH settings can be edited if no check connection task is in progress
     */
    allowEdit : function() {
      return ! (this.checkSSHConnectionTask && this.checkSSHConnectionTask.status === "BUSY");
    }
  },
  methods : {
    /**
     * Test that current SSH connection settings are correct by trying to open a
     * connection to host.
     */
    testConnection : function() {
      service.sshInfo.getInfo(this.item.data.ssh) // user may be prompted
      .then( sshOptions => {
        // now that we have ssh connection params, let's start the real work
        this.connectionOk = null;
        return service.ssh.checkConnection(sshOptions);
      })
      .then( success => {
        this.connectionOk = true;
      })
      .catch(error => {
        if( error === "canceled-by-user") {
          // user has been prompted for password and pressed cancel
          this.connectionOk = true;
        } else {
          this.connectionOk = false;
          service.sshInfo.clearCachedPassword(this.item.data.ssh);
          service.notification.error(error,"Failed to connect");
        }
      });
    },
    /**
     * Handle Notes update : updtae the store and the file is note have been
     * updated by user
     */
    changeNotesValue : function(arg) {
      store.commit('updateDesktopItem', {
        id          : this.item.data._id,
        updateWith  : {
          notes  : arg.value
        }
      });
      persistence.saveDesktopItemToFile(this.item);
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
        id         : this.item.data._id,
        selector   : 'ssh',
        updateWith : {}
      };
      updateData.updateWith[arg.name] = arg.value;
      store.commit('updateDesktopItem',updateData);
      persistence.saveDesktopItemToFile(this.item);
    }
  },
  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * id is passed as a path param.
   */
  mounted : function(){
    // find the desktop item in the store
    this.item = this.$store.getters.desktopItemById(this.$route.params.id);
    if( ! this.item ) {
      console.warn("fail to load item : id = "+this.$route.params.id);
    }
  }
};
