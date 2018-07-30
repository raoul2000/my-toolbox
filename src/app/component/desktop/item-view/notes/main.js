'use strict';

const validate         = require('validator');
var service            = require('../../../../service/index');
var checkSSHConnection2            = require('../../../../service/ssh/check-connection');

module.exports = {
  components : {
    "inlineTextarea" : require('../../../../lib/component/inline-textarea')
  },
  template: require('./main.html'),
  data : function(){
    return {
      item         : null,
      validation : {
        "notes"    : true
      }
    };
  },
  computed : {
    /**
     * SSH settings can be edited if no check connection task is in progress
     */
    allowEdit : function() {
      return ! (this.checkSSHConnectionTask && this.checkSSHConnectionTask.status === "BUSY");
    }
  },
  methods : {
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
      service.persistence.saveDesktopItemToFile(this.item);
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
