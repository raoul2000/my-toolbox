'use strict';

var remote = require('electron').remote;
var fs       = require('fs');
var path     = require('path');
const store  = require('../../../service/store/store');
const ACTION = require('../lib/module').ACTION;


/**
 * The Main vuesjs component
 * @type {Object}
 */
module.exports = {
  template : require('./main.html'),
  props    : ['module','deployFolder'],
  data     : function() {
    // this data ojbject is used as the form model so the user can modify
    // metadata. Other module properties are computed properties.
    return {
      "metadata" : {
        "symlink" : this.module.metadata.symlink,
        "version" : this.module.metadata.version,
        "installFolder" : this.module.metadata.installFolder
      }
    };
  },
  computed: {
    inEdition: function () {
      return this.module.status === ACTION.EDITING;
    },
    status: function() {
      return this.module.status;
    },
    progress: function() {
      return `${this.module.progress}%`;
    },
    busy: function() {
      return this.module.busy;
    },
    step: function() {
      return this.module.step;
    },
    /**
     * Reflects the module selection check box
     */
    selected : {
      get()  {
        let module = store.getters.getModuleByDataFilename(this.module.dataFilename);
        if( module !== undefined ) {
          return module.selected;
        }
      },
      set(value) {
        store.commit('updateModule', {
          "dataFilename" : this.module.dataFilename,
          "updateWith"   : {
            "selected" : value
          }
        });
      }
    }
  },
  methods : {
    /**
     * Set this module in edit mode.
     * This change is applied on the stored module object
     */
    enableEditMode : function() {
      store.commit('updateModule', {
        "dataFilename" : this.module.dataFilename,
        "updateWith"   : {
          "status" : ACTION.EDITING,
          "busy"   : true
        }
      });
    },
    /**
     * User has finished editing metadata for this module.
     * Walidate user input and on success :
     * - update the stored module
     * - update the local metadata file
     *
     */
    submitChanges : function() {
      console.log('submitChanges');
      // validate changes
      if( this.metadata.version.length === 0 ) {
        notify('A <b>version number</b> is required','error','error');
      } else if( this.metadata.symlink.length === 0 ) {
        notify('A <b>symlink</b> value is required','error','error');
      } else if( this.metadata.installFolder.length === 0 ) {
        notify('A <b>install folder</b> value is required','error','error');
      } else {

        // User input is Valid : update the store

        store.commit('updateModule', {
          "dataFilename" : this.module.dataFilename,
          "updateWith"   : {
            "status"   : "start",
            "busy"     : false,
            "metadata" : this.metadata
          }
        });

        // write to local metadata file

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
  }
};
