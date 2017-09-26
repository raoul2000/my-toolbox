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
          }
        ]
      };
    },
  template: require('./main.html')
};
