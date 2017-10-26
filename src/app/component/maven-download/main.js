var electron   = require('electron');
var remote     = require('electron').remote;
var fs         = require('fs');
var path         = require('path');
const config   = require('../../service/config');


Vue.component('module-row', require('./module-row/main'));

module.exports = {
  data : function(){
    return {
        "modules" : []
      };
    },
  template: require('./main.html'),
  computed: {
  },
  methods : {
    refresh : function() {

      let modRefFilename = path.join(
        config.get('nexus.confFolder'),
        'module-ref.json'
      );
      console.log("loading module-ref from file : "+modRefFilename);
      this.modules = JSON.parse(fs.readFileSync(modRefFilename, "utf-8" ));
    }
  },
  mounted : function(){
    var self = this;
    if(config.has('nexus.confFolder') === false ) {
      notify('No nexus.confFolder configured','error', 'error');
      return;
    }
    var nexusConfFolder = config.get('nexus.confFolder');
    if ( fs.existsSync(nexusConfFolder) === false ) {
      notify(`Configured Deploy Folder Not Found : <b>${nexusConfFolder}</b>`,'error', 'error');
      return;
    }
    console.log("deployFolder = ",nexusConfFolder);

    this.refresh();
  }
};
