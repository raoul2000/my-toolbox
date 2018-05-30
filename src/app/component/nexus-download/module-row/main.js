'use strict';

const service   = require('../../../service/index');
const path     = require('path');
const fs       = require('fs');

module.exports = {
  template : require('./main.html'),
  props    : ['module'],
  data     : function() {
    return {
      "status"             : "IDLE",
      "selectedModuleType" : "release",
      "selectedVersion"    : null,
      "selectedFilename"   : "",
      "selectedFile"       : null,
      "version"            : {
        "release"  : [],
        "snapshot" : [],
        "file"     : []
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
    selectedModuleType : function() {
      this.selectedVersion = null;
    },
    selectedVersion : function() {
      if( this.selectedVersion !== null) {
        this.loadfileList();
      } else {
        this.version.file = [];
      }
    },
    selectedFile : function() {
      console.log(this.selectedFile);
    }
  },
  methods : {

    startDownload : function() {
      let fileObject = this.version.file.find( item => item.resourceURI = this.selectedFile);
      debugger;
      console.log(fileObject);
      if( ! fileObject) {
        return;
      }

      // create local filepath /////////////////////////////////////////////////
      //
      let destinationFilepath = path.join(service.config.store.get('deployFolderPath') , fileObject.text);
      console.log("destinationFilepath = "+destinationFilepath);

      // if target file already exist, delete it ///////////////////////////////
      //
      if( fs.existsSync(destinationFilepath)) {
        fs.unlinkSync(destinationFilepath);
      }


      service.nexus.download.start({
        "url"           : fileObject.resourceURI,
        "filename"      : fileObject.text, // webapp-2-3-6.war
        "moduleId"      : this.module.id,
        "destinationFilepath" : destinationFilepath
      })
      .catch(error => {
        service.notification.error(error,"Oups ! Something is broken and the download failed");
      });

    },
    /**
     * this.selectedModuleType = snapshot | release
     * this.selectedVersion = http://127.0.0.1:8080/nexus/content/repositories/public/webappName/3.0.10-SNAPSHOT/"
     * @return {[type]} [description]
     */
    loadfileList : function() {
      service.nexus.browse.list(this.selectedVersion)
      .then( result => {
        console.log(result);
        this.version.file = result
          .filter( item => item.leaf && item.text.toLowerCase().endsWith('.war') );

        if( this.version.file.length === 1) {
          this.selectedFile = this.version.file[0].resourceURI;
        }
      })
      .catch(error => {
        service.notification.error(error,"Failed to reach the Nexus !");
      });
    },
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
