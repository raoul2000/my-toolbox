'use strict';

const service  = require('../../../../service/index');

module.exports = {
  components : {
    "inlineTextarea" : require('../../../../lib/component/inline-textarea')
  },
  template: require('./main.html'),
  data : function(){
    return {
      item         : null,
      isReadOnly   : service.db.isReadOnly(),
      validation   : {
        "notes"  : true
      }
    };
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
