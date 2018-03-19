'use strict';

const validate         = require('validator');
var fs                 = require('fs');
var path               = require('path');
const config           = require('../../../../service/config');
var persistence        = require('../../../../service/persistence');
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
      console.log('addComponent');
      this.$store.commit('addComponent', {
        "item"      : this.item,
        "component" : {
          "_id"     : helper.generateUUID(),
          "name"    : "",
          "version" : ""
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
