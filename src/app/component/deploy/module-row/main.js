'use strict';

var remote = require('electron').remote;
var fs         = require('fs');
var path         = require('path');

/**
 * The Main vuesjs component
 * @type {Object}
 */
module.exports = {
  template : require('./main.html'),
  props    : ['module','deployFolder'],
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
        let metafilePath = path.join(this.deployFolder, this.module.metaFilename);
        console.log('updating file',metafilePath );
        let newMeta = this.module.metadata;
        console.log('newMeta',JSON.stringify(newMeta, null ,2) );
        try {
          fs.writeFileSync(metafilePath, JSON.stringify(newMeta, null ,2));
        } catch (e) {
          notify( "Failed to save metadata file "+metafilePath,'error','error');
          console.warn("failed to save metadata file "+metafilePath,e);
        }
      }
    }
  },
  watch: {
  }
};
