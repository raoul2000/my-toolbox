var electron = require('electron');
var remote = require('electron').remote;
var fs = require('fs');
const store    = require('../../service/store/store');

module.exports = {
  data : function(){
    return {
        "modules" : [
          {
            "selected" : false, // extra
            "filename" : "/folder/file.txt",
            "metadata" : {
              "symlink" : "file",
              "version" : "1.0.2",
              "installFolder" : "file-1.0.2"
            }
          },
          {
            "selected" : false, // extra
            "filename" : "/folder/file2.txt",
            "metadata" : {
              "symlink" : "file2",
              "version" : "1.0.22",
              "installFolder" : "file-1.0.22"
            }
          }
        ]
      };
    },
  template: require('./main.html'),
  mounted : function(){
    var self = this;
  }
  
};
