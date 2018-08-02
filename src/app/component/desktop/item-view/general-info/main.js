'use strict';

const validate = require('validator');
const service  = require('../../../../service/index');

module.exports = {
  props: ['item'],
  components : {
    "inlineInput"    : require('../../../../lib/component/inline-input'),
    "inlineTextarea" : require('../../../../lib/component/inline-textarea'),
    "autocomplete"   : require('../../../../lib/component/auto-complete'),
    "color-picker"   : require('vue-color').Chrome
  },
  template: require('./main.html'),
  data : function(){
    return {
      "colors"      : '#333',
      "optionColor" : 'auto',
      validation : {
        "host"     : true,
        "username" : true,
        "password" : true,
        "port"     : true,
      },
      "fieldPassword" : null
    };
  },
  computed : {
    /**
     * Returns CSS style color background for this item
     */
    itemBgColor : function(item) {
      return {
        "background-color" : service.ui.getItemColor(this.item)
      };
    },    
    /**
     * User can test SSH connection (button enabled) if :
     * - no check task is in progress
     * - host is not empty
     * - username is nopt empty
     * If password is empty it will be prompted.
     */
    canTestConnection : function(){
      return this.item.inProgress !== true
        && this.item.data.ssh.username.length !== 0
        && this.item.data.ssh.host.length > 0;
    },
    /**
     * SSH settings can be edited if no check connection task is in progress
     */
    allowEdit : function() {
      return this.item.inProgress !== true; // inProgress could be NULL, FALSE or TRUE
    }
  },
  methods : {
    /**
     * Test that current SSH connection settings are correct by trying to open a
     * connection to host.
     * 
     * Note that if no password is saved at the item level, user must enter it (and possibly
     * temporary save it to cache for the session)
     */    
    ping : function() {
      // Get SSH password : user is prompted to enter password if not saved in the item
      service.ssh.getInfo(this.item.data.ssh) 
        .then( sshOptions => {
          // now that we have ssh connection params, let's start the real work
          store.commit('updateDesktopItem', {
            id         : this.item.data._id,
            selector   : 'desktop',
            updateWith : {
              inProgress           : true,
              isAlive              : null,
              isAliveStatusMessage : null
            }
          }); 
          return service.ssh.checkConnection(sshOptions)
          .then( success => {
            console.log(success);
            store.commit('updateDesktopItem', {
              id         : this.item.data._id,
              selector   : 'desktop',
              updateWith : {
                inProgress           : false,
                isAlive              : true,
                isAliveStatusMessage : "server is alive"
              }
            });          
          });
        })
        .catch(error => {
          if( error !== "canceled-by-user") {
            store.commit('updateDesktopItem', {
              id         : this.item.data._id,
              selector   : 'desktop',
              updateWith : {
                inProgress           : false,
                isAlive              : false,
                isAliveStatusMessage : error
              }
            });                
            service.ssh.clearCachedPassword(this.item.data.ssh);
            service.notification.error(
              `The server <b>${this.item.path.join(' / ')}</b> could not be reached.<br/> The error returned is : 
              <pre>${error}</pre>`,
              "Failed to connect"
            );
          } else {
            store.commit('updateDesktopItem', {
              id         : this.item.data._id,
              selector   : 'desktop',
              updateWith : {
                inProgress           : false,
                isAlive              : null,
                isAliveStatusMessage : null
              }
            });              
          }
        }
      );
    },    
    /**
     * Update the color value selected by the user. It is not saved to the item
     * until user press "Save Changes"
     */
    updateColorValue : function(arg) {
      this.colors = arg;
    },    
    openColorPicker : function() {
      $('#color-picker-modal').modal("show");
    },    
    /**
     * User wants to "Save Changes" o,n the item color
     */
    saveColor : function(){
      $('#color-picker-modal').modal('hide');      
      let selectedColor = typeof this.colors === "object" ? this.colors.hex : this.colors;

      let itemColor = null;
      if( this.optionColor === 'manual') {
        itemColor = selectedColor;
      } 
      if( this.item.data.color !== itemColor) {
        store.commit('updateDesktopItem', {
          id         : this.item.data._id,
          updateWith : {
            color : itemColor
          }
        });
        service.persistence.saveDesktopItemToFile(this.item);
      }
    },    
    /**
     * Handle SSH settings update : update the store and the file.
     * Note that validation is not blocking the save operation.
     */
    changeSSHValue : function(arg){
      let valueToSave = arg.value;
      if( arg.name === "host") {
        // host is actually IP
        // TODO : change property name from 'host' to 'ip'
        this.validation[arg.name] = validate.isIP(arg.value);
      } else if( arg.name === "port") {
        // port is not required (default is 22) but if set, it must  be valid
        this.validation[arg.name] = validate.isEmpty(arg.value) ? true : validate.isInt(arg.value+'',{ gt : 0});
      } else if( arg.name === 'password') {
        valueToSave = service.secret.encrypt(arg.value);
      }

      // update store and file is ALWAYS done (even if validation fails)
      let updateData =  {
        id         : this.item.data._id,
        selector   : 'ssh',
        updateWith : {}
      };
      updateData.updateWith[arg.name] = valueToSave;
      store.commit('updateDesktopItem',updateData);
      service.persistence.saveDesktopItemToFile(this.item);
    }
  },
  beforeMount : function() {
    if( this.item.data.color) {
      this.colors = this.item.data.color;
      this.optionColor = 'manual';
    } 
    this.fieldPassword = this.item.data.ssh.password;
  }
};
