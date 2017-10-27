'use strict';

const remote   = require('electron').remote;
const fs       = require('fs');
const path     = require('path');
const store    = require('../../../service/store/store');
const nexusAPI = require('../lib/nexus-api');
const nexusDownloader = require('../lib/nexus-downloader');
const config   = require('../../../service/config');

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
      "filenameOptions"    : [],
      "task" : null,
      "downloadFolder" : ""
    };
  },
  computed: {
    /**
     * Returns the version info for the currently selected module type (release/snapshot)
     * @return {[type]} [description]
     */
    moduleVersionOptions : function() {
      return this.selectedModuleType === 'release' ? this.version.release : this.version.snapshot;
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
    }
  },
  watch : {
    selectedModuleType : function() {
      this.selectedVersion = null;
    },
    selectedVersion : function() {
      this.filenameOptions = [];
      this.selectedFilename = "";
      if(  ! this.selectedVersion ) {
        return;
      }
      // intialize the version url that is used to get all files available for a given
      // module, version, and version category (e.g. m1, version 1.2 - cat : release)
      let versionListUrl = '';
      let self = this;
      if( this.selectedModuleType.cat === 'release') {
        versionListUrl = this.module.url.release + '/' + this.selectedVersion;
      } else {
        versionListUrl = this.module.url.snapshot + '/' + this.selectedVersion;
      }
      console.log("versionListUrl = ",versionListUrl);
      self.status = "LOADING_FILENAME";
      nexusAPI.getWarfileDescriptor(versionListUrl)
      .then(function(warfileDesc){
        self.filenameOptions = warfileDesc; // array of file descriptors
        if(warfileDesc.length === 1) {
          self.selectedFilename = warfileDesc[0].text;
        }
        self.status = "IDLE";
      });
    }
  },
  methods : {
    startDownload : function() {
      this.status = "DOWNLOAD_IN_PROGRESS";
      store.commit("addTask",{
        "id"       : this.module.id,
        "type"     : "download",
        "status"   : "started", // "started", "done"
        "progress" : 0,
        "input"    : {
          "selectedFilename" : this.selectedFilename
        }
      });
      nexusDownloader.download(
        downloadUrl,
        localFilePath,
        config.get('nexus.requestTimeout'),
        downloadContinue(arg.moduleId)
      )
    },
    loadVersionInfo : function() {
      console.log('loading version info : ',this.module.id);
      this.status = "LOADING_VERSION";

      let extractReleaseVersion = function(info) {
        if (info.data && Array.isArray(info.data)) {
          return info.data.filter(function(item) {
            return item.leaf === false && item.text.toUpperCase().endsWith('-SNAPSHOT') === false;
          }).map(function(item) {
            return item.text;
          });
        } else {
          return [];
        }
      };

      let extractSnapshotVersion = function(info) {
        if (info.data && Array.isArray(info.data)) {
          return info.data.filter(function(item) {
            return item.leaf === false  && item.text.toUpperCase().endsWith('-SNAPSHOT') === true;
          }).map(function(item) {
            return item.text;
          });
        } else {
          return [];
        }
      };

      nexusAPI.fetchModuleVersion(this.module)
      .then( result => {
        if( result.release && result.snapshot) {
          this.version = {
            release: extractReleaseVersion(result.release),
            snapshot: extractSnapshotVersion(result.snapshot)
          };
        }
        this.status = "IDLE";
      });
    }
  },
  mounted : function(){
    this.task =  store.getters.findTaskById(this.module.id);
    console.log('mounted : task = ',this.task);
    if( this.task ) {
      this.status = "DOWNLOAD_IN_PROGRESS";
      this.selectedFilename = this.task.input.selectedFilename;
      this.filenameOptions.push(this.selectedFilename);
    }
  }
};
