

module.exports = new Vuex.Store({
  state: {
    currentRoute : null,
    desktop : [],
    webappDefinition : [],
    modules : []
  },
  getters: {
    desktopItemByIndex : function(state, getters) {
      return function(index) {
        return state.desktop[index];
      };
    },
    desktopItemByFilename : function(state, getters) {
      return function(filename) {
        return state.desktop.find( item => item.filename === filename);
      };
    },
    webappDefById : function(state, getters) {
      return function(webappId) {
        return state.webappDefinition.find( item => item.id === webappId);
      };
    },
    getModuleByDataFilename : function(state, getters) {
      return function(dataFilename) {
        return state.modules.find( item => item.dataFilename === dataFilename);
      };
    },
    getModuleIndexByDataFilename : function(state, getters) {
      return function(dataFilename) {
        return state.modules.findIndex( item => item.dataFilename === dataFilename);
      };
    }
  },
  mutations: {
    setWebAppDefinition(state, definition) {
      state.webappDefinition = definition;
    },
    setCurrentRoute(state, route) {
      state.currentRoute = route;
    },
    increment (state) {
      state.count++;
    },
    addToDesktop ( state, item) {
      state.desktop.push(item);
    },
    removeFromDesktop (state, index) {
      state.desktop.splice(index, 1);
    },
    addModule(state, module) {
      state.modules.push(module);
    },
    updateModules_ok(state, freshModules) {
      // add
      for (var i = 0; i < freshModules.length; i++) {
        let freshModule = freshModules[i];
        if( state.modules.findIndex( curModule => curModule.dataFilename === freshModule.dataFilename) === -1) {
          console.log("fresh module to insert", freshModule);
          state.modules.push(freshModule);
        }
      }

      // remove
      let idxToRemove = [];
      for (var i = 0; i < state.modules.length; i++) {
        let currentModule = state.modules[i];
        if( freshModules.findIndex( freshModule => freshModule.dataFilename === currentModule.dataFilename) === -1) {
          console.log("current module to remove (delayed)", currentModule);
          idxToRemove.push(i);
        }
      }
      console.log('index to remove', idxToRemove);
      //let orderIdx = idxToRemove.sort().reverse();
      let orderIdx = idxToRemove.sort(function(a, b){return b-a})
      console.log('index to remove (ordered)', orderIdx);

      orderIdx.forEach( idx => {
        console.log('removing idx', idx);
        state.modules.splice(idx, 1);
      });
    },
    updateModules(state, freshModules) {
      // push freshModules not already present in the store.modules
      freshModules
        .filter( freshModule  => state.modules.findIndex( currentModule => currentModule.dataFilename === freshModule.dataFilename) === -1)
        .forEach( freshModule => {
          console.log("adding module ",freshModule);
          state.modules.push(freshModule);
        });

      // remove store.modules not present in freshModules
      let revIdx = state.modules
        .map( (currentModule, index) => {
          return {"index" : index, "module" : currentModule};
        } )
        .filter( currentItem => freshModules.findIndex(freshModule => freshModule.dataFilename === currentItem.module.dataFilename) === -1)
        .sort(function(a, b){return b.index - a.index})
        .forEach( item => {
          console.log("deleting module index",item.index);
          state.modules.splice(item.index, 1);
        });
    }
  }
});
