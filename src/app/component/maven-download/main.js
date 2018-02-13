var electron   = require('electron');
var remote     = require('electron').remote;
var fs         = require('fs');
var path         = require('path');
const config   = require('../../service/config');
const store    = require('../../service/store/store');


Vue.component('module-row', require('./module-row/main'));

module.exports = {
  data : function(){
    return {
      "modules"    : store.state.webappDefinition,
      "filterText" : ""
    };
  },
  template: require('./main.html'),
  computed : {
    filteredModules : function() {
      if( this.filterText.trim().length === 0) {
        return this.modules;
      } else {
        let normalizedFilter = this.filterText.toLowerCase();
        return this.modules.filter( module => {
          return module.name.concat(module.id).toLowerCase().match(normalizedFilter);
        });
      }
    }
  },
  methods : {
    refresh : function() {

      let modRefFilename = path.join(
        config.store.get('nexus.confFolder'),
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
