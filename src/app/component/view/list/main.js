'use strict';

var remote = require('electron').remote;
/**
 * from https://github.com/sindresorhus/semver-regex
 * @return {[type]} [description]
 */
function semverRegex() {
	return /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/ig;
}

function standardVersionExtractor(baseUrl, self) {
    fetch(baseUrl+'/service/ui/info')
    .then(response => {
      console.log(response);
      self.success = response.ok;
      if(response.ok){
        response.text().then(function (xmlStr) {
          var dom =  ( new DOMParser() ).parseFromString(xmlStr, "text/xml");
          var result = dom.evaluate('/info/version',dom,null,XPathResult.STRING_TYPE,null);
          if(result && result.stringValue) {
            self.version = result.stringValue;
            self.$emit('action-completed', {
							"action"  : "version-all",
							"success" : true,
							"value"   : {
								"id"      :  self.item.id,
								"version" : result.stringValue
							}
						});
          }
          self.disabledTest = false;
        });
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(function(error) {
      self.success = false;
      self.disabledTest = false;
      self.$emit('action-completed',  {
				"action" : "version-all",
				"success" : false
			});
    });
}

function mrasVersionExtractor(baseUrl, self) {
    fetch(baseUrl+'/rest')
    .then(response => {
      console.log(response);
      self.success = response.ok;
      if(response.ok){
        response.json().then(function (info) {
          self.version = info.version;
          self.disabledTest = false;
          self.$emit('action-completed',  {
						"action"  : "version-all",
						"success" : true,
						"value"   : {
							"id"      :  self.item.id,
							"version" : info.version
						}
					});
        });
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(function(error) {
      self.success = false;
      self.disabledTest = false;
      self.$emit('action-completed',  {
				"action" : "version-all",
				"success" : false
			});
    });
}


function previewVersionExtractor(baseUrl, self) {
    fetch(baseUrl)
    .then(response => {
      console.log(response);
      self.success = response.ok;
      if(response.ok){
        response.text().then(function (htmlStr) {
          var semver = semverRegex().exec(htmlStr);
          if(semver) {
            self.version = semver[0];
						self.$emit('action-completed',  {
							"action"  : "version-all",
							"success" : true,
							"value"   : {
								"id"      : self.item.id,
								"version" : self.version
							}
						});
						self.disabledTest = false;
          } else {
						throw new Error("failed to extract version");
					}
        });
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(function(error) {
      self.success = false;
      self.disabledTest = false;
      self.$emit('action-completed',  {
				"action"  : "version-all",
				"success" : false
			});
    });
}

/**
 * The Main vuesjs component
 * @type {Object}
 */
module.exports = {
  template : require('./main.html'),
  props    : ['item', 'action'],
  data     : function() {
    return {
      success      : null,
      disabledTest : false,
      version      : '...'
    };
  },
  methods : {
    pingURL : function(){
      console.log("testing url ",this.item.url);
      var self = this;
      this.success = null;
      this.disabledTest = true;
      fetch(this.item.url)
      .then(response => {
        self.success = response.ok;
        self.disabledTest = false;
        self.$emit('action-completed', {
					"action" : "ping-all",
					"success" : true
				});
      })
      .catch(function(error) {
        self.success = false;
        self.disabledTest = false;
        self.$emit('action-completed', {
					"action" : "ping-all",
					"success" : false
				});
      });
    },
    openUrlExternal : function(url) {
      remote.shell.openItem(this.item.url);
    },
    /**
     * tries to retrieve end point version info
     */
    getVersion : function(){
      console.log("getVersion url ",this.item.url);
      var self = this;
      this.success = null;
      this.disabledTest = true;
      if( this.item.type === "mras") {
        mrasVersionExtractor(this.item.url, self);
      } if( this.item.type === "preview") {
        previewVersionExtractor(this.item.url, self);
      } else {
        standardVersionExtractor(this.item.url, self);
      }
    }
  },
  watch: {
    action: function (newAction) {
      if(newAction === 'ping-all') {
        this.pingURL();
      } else if( newAction === 'version-all') {
        this.getVersion();
      }
    },
    item : function(newItem) {
      console.log(newItem);
      this.success = null;
      this.disabledTest = false;
      this.version = '??';
    }
  }
};
