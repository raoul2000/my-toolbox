var electron   = require('electron');
var remote     = require('electron').remote;
var fs         = require('fs');
var path         = require('path');
const config   = require('../../service/config');
const store    = require('../../service/store/store');


Vue.component('module-row', require('./module-row/main'));

module.exports = {
  data : function(){
    return { "modules" : store.state.webappDefinition };
    },
  template: require('./main.html'),
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


    //this.refresh();
  }
};
