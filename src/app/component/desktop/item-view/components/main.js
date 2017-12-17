'use strict';

const validate         = require('validator');
var fs                 = require('fs');
var path               = require('path');
const config           = require('../../../../service/config');
var persistence        = require('../../../../lib/lib').persistence;
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
  computed : {
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
      persistence.saveDesktopnItemToFile(this.item);
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
