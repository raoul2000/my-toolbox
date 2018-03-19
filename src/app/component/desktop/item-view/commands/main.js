'use strict';

const validate         = require('validator');
var fs                 = require('fs');
var path               = require('path');
const config           = require('../../../../service/config');
var persistence        = require('../../../../service/persistence');
const helper           = require('../../../../lib/lib').helper;

module.exports = {
  components : {
    "inlineInput"  : require('../../../../lib/component/inline-input'),
    "commandRow"   : require('./command-row/main')
  },
  template: require('./main.html'),
  data : function(){
    return {
      item         : null
    };
  },
  methods : {
    /**
     * Add a command to the parent item
     * The item file and the store are updated
     */
    addCCommand : function() {
      this.$store.commit('addCommand', {
        "item"      : this.item,
        "command"   : {
          "_id"     : helper.generateUUID(),
          "name"    : "",
          "source"  : ""
        }
      });
      persistence.saveDesktopItemToFile(this.item);
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
