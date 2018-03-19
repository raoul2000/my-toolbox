'use strict';

const validate         = require('validator');
var fs                 = require('fs');
var path               = require('path');
const config           = require('../../../../service/config');
var checkSSHConnection = require('../../../../lib/ssh/check-connection').checkConnection;
var persistence        = require('../../../../service/persistence');

module.exports = {
  components : {
    "inlineInput"    : require('../../../../lib/component/inline-input'),
    "inlineTextarea" : require('../../../../lib/component/inline-textarea'),
    "autocomplete"   : require('../../../../lib/component/auto-complete')
  },
  template: require('./main.html'),
  data : function(){
    return {
      action       : null, // 'test-connection'
      connectionOk : true,
      item         : null,
      validation : {
        "host"     : true,
        "username" : true,
        "password" : true,
        "port"     : true,
        "notes"    : true
      },
      allowEdit    : true,
      selection: '',
      suggestions: [
        { city: 'Bangalore', state: 'Karnataka' },
        { city: 'Chennai', state: 'Tamil Nadu' },
        { city: 'Delhi', state: 'Delhi' },
        { city: 'Kolkata', state: 'West Bengal' },
        { city: 'Mumbai', state: 'Maharashtra' }
      ]

    };
  },
  computed : {
    canTestConnection : function(){
      return this.action === null
        && this.item.data.ssh.host.length > 0
        && this.item.data.ssh.username.length > 0
        && this.item.data.ssh.password.length > 0;
    }
  },
  methods : {
    testConnection : function() {
      let self = this;
      this.allowEdit = false;
      this.action = "test-connection";
      this.connectionOk = null;
      checkSSHConnection(this.item.data.ssh)
      .then( success => {
        this.connectionOk = true;
        this.action       = null;
        self.allowEdit    = true;
      })
      .catch(error => {
        this.action       = null;
        this.connectionOk = false;
        self.allowEdit    = true;
      });
    },
    /**
     * Handle Notes update : updtae the store and the file
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
