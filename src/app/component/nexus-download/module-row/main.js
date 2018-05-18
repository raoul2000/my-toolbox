'use strict';

const service   = require('../../../service/index');

/**
 * The Main vuesjs component
 * @type {Object}
 */
module.exports = {
  template : require('./main.html'),
  props    : ['module'],
  data     : function() {
    return {
      "status"             : "IDLE",
      "selectedModuleType" : "release",
      "selectedVersion"    : null,
      "selectedFilename"   : "",
      "version"            : {
        "release"  : [],
        "snapshot" : []
      },
      "filenameOptions"       : [],
      "downloadFolder"        : "",
      "stopDownloadRequest"   : false,
      "loadVersionInfoTaskId" : null
    };
  },
  computed: {
    loadingVersionInfo : function(){
       let task = service.store.getters['tmptask/taskById'](this.loadVersionInfoTaskId);
       return task && task.status === "BUSY";
    },
    moduleTypeOptions : function() {
      var options = [];
      if(this.version.release.length !== 0 ) {
        options.push("release");
      }
      if(this.version.snapshot.length !== 0 ) {
        options.push("snapshot");
      }
      return options;
    },
    /**
     * Returns the version info for the currently selected module type (release/snapshot)
     * @return {[type]} [description]
     */
    moduleVersionOptions : function() {
      return this.selectedModuleType === 'release' ? this.version.release : this.version.snapshot;
    }
  },
  watch : {
    selectedVersion : function() {
      debugger;
      console.log(this.selectedModuleType);
      console.log(this.selectedVersion);

    }
  },
  methods : {
    /**
     * Loads version from the Nexus repository and populate the SNAPSHOT and RELEASE option
     * lists
     */
    loadVersionInfo : function() {

      service.nexus.browse.loadVersionInfo(this.module)
      .then( result => {

        // populate SNAPSHOT options
        this.version.snapshot = result
          .filter( item => item.leaf === false && item.text.toUpperCase().endsWith('-SNAPSHOT') )
          .map( item => ({ "text" : item.text.replace('-SNAPSHOT',''), "resourceURI" : item.resourceURI}));

        // populate RELEAS options
        this.version.release = result
          .filter( item => item.leaf === false && item.text.toUpperCase().endsWith('-SNAPSHOT') === false )
          .map( item => ({ "text" : item.text, "resourceURI" : item.resourceURI}));
      })
      .catch(error => {
        service.notification.error(error,"Failed to reach the Nexus !");
      });
    }
  },
  mounted : function(){
    this.loadVersionInfoTaskId = service.nexus.browse.createTaskId(this.module);
  }
};
