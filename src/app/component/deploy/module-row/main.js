'use strict';

var remote = require('electron').remote;

/**
 * The Main vuesjs component
 * @type {Object}
 */
module.exports = {
  template : require('./main.html'),
  props    : ['module'],
  data     : function() {
    return {
      "editionMode" : false
    };
  },
  methods : {
    submitChanges : function() {
      console.log('submitChanges');
      // validate changes
      if( this.module.metadata.version.length === 0 ) {
        notify('A <b>version number</b> is required','error','error');
      } else if( this.module.metadata.symlink.length === 0 ) {
        notify('A <b>symlink</b> value is required','error','error');
      } else if( this.module.metadata.installFolder.length === 0 ) {
        notify('A <b>install folder</b> value is required','error','error');
      } else {
        this.editionMode = false;
        // TODO : update the corresponding metadata file with new entered values
      }
    }
  },
  watch: {
  }
};
