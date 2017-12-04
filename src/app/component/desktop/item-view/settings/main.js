
const validate = require('../../../../lib/validation');
const config   = require('../../../../service/config');

var fs         = require('fs');
var path       = require('path');


module.exports = {
  components : {
    "inlineInput"    : require('../../../../lib/component/inline-input'),
    "inlineTextarea" : require('../../../../lib/component/inline-textarea')
  },
  data : function(){
    return {
      data : null,
      filename : "",
      validation : {
        "host"     : true,
        "username" : true,
        "password" : true,
        "port"     : true,
        "notes"    : true
      }
    };
  },
  template: require('./main.html'),
  methods : {
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
        filename : this.filename,
        updateWith   : {
          notes  : arg.value
        }
      });
      // update the file
      this.updateDesktopItemFile();
    },
    /**
     * Handle SSH settings update : updtae the store and the file
     */
    changeSSHValue : function(arg){

      if( arg.name === "host") {
        // host is actually IP
        // TODO : change property name from 'host' to 'ip'
        this.validation[arg.name] = validate.isIP(arg.value);
      } else if( arg.name === "port" && arg.value !== '') {
        // port is not required (default is 22) but if set, it must
        // be validated
        this.validation[arg.name] = validate.isPortNumber(arg.value);
      }

      if( this.validation[arg.name] ) {
        let updateData =  {
          filename : this.filename,
          selector : 'ssh',
          updateWith : {}
        };
        updateData.updateWith[arg.name] = arg.value;
        store.commit('updateDesktopItem',updateData);
        // update the file
        this.updateDesktopItemFile();
      }
    }
  },

  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
  mounted : function(){
    let desktopItemIndex = this.$route.params.id;
    if( desktopItemIndex === -1 ) {
      console.error("missing desktopn item index");
      return;
    }
    this.desktopItemIndex = this.$route.params.id;
    // find the desktop item in the store
    let dkItem = this.$store.getters.desktopItemByIndex(desktopItemIndex);
    this.data = dkItem.data;
    this.filename = dkItem.filename;
  }
};
