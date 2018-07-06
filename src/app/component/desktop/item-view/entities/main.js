'use strict';

const validate         = require('validator');
var service            = require('../../../../service/index');
var checkSSHConnection2            = require('../../../../service/ssh/check-connection');

module.exports = {
  template: require('./main.html'),
  data : function(){
    return {
      item : null
    };
  },
  methods : {
    /**
     * Build the summary view for the selected desktop item. The dekstop item
     * id is passed as a path param.
     */
    mounted : function(){
      // find the desktop item in the store
      debugger;
      this.item = this.$store.getters.desktopItemById(this.$route.params.id);
      if( ! this.item ) {
        console.warn("fail to load item : id = "+this.$route.params.id);
      }
    }
  }
}
