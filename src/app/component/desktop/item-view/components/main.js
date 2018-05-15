'use strict';

var service        = require('../../../../service/index');
const helper           = require('../../../../lib/lib').helper;

module.exports = {
  components : {
    "inlineInput"    : require('../../../../lib/component/inline-input'),
    "componentRow"   : require('./component-row/main')
  },
  template: require('./main.html'),
  data : function(){
    return {
      item         : null
    };
  },
  methods : {
    addComponent : function() {
      this.$store.commit('addComponent', {
        "item"      : this.item,
        "component" : {
          "_id"     : helper.generateUUID(),
          "name"    : "",
          "version" : ""
        }
      });
      service.persistence.saveDesktopItemToFile(this.item);
    }
  },
  /**
   * Load the parent item using route param 'id'
   */
  mounted : function(){
    // find the desktop item in the store
    this.item = this.$store.getters.desktopItemById(this.$route.params.id);
    if( ! this.item ) {
      console.warn("fail to load item : id = "+this.$route.params.id);
    }
  }
};
