

module.exports = new Vuex.Store({
  strict: true, // TODO : DEV only
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
    /**
     * Replace stores modules with freshModules
     * @param  {object} state        the store state
     * @param  {Array} freshModules list of modules
     */
    initModuleList(state, freshModules) {
      state.modules = freshModules;
    },
    /**
     * Update the list of modules int the store taking freshModules into account.
     * Modules are identified by dataFilename. Note that the entire module is not updated
     * if for instance some metadata have changed (e.g. modified outside of the app)
     *
     * @param  {[type]} state        [description]
     * @param  {array} freshModules  freshModule array
     */
    updateModuleList(state, freshModules) {
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
        .sort(function(a, b){return b.index - a.index}) // sort reverse index (from higher to lower index) to be able to use splice (see below)
        .forEach( item => {
          console.log("deleting module index",item.index);
          state.modules.splice(item.index, 1);
        });
    },
    /**
     * Updates a single module in the store using the freshModule
     * @param  {[type]} state       [description]
     * @param  {[type]} freshModule [description]
     * @return {[type]}             [description]
     */
    updateModule(state, args, source ) {
      let idx = state.modules.findIndex( currentModule => currentModule.dataFilename === args.dataFilename);
      if( idx !== -1) {
        let target = state.modules[idx];
        Object.keys(args.updateWith)
        .filter( sourceProp => target.hasOwnProperty(sourceProp))
        .forEach( sourceProp => {
          // TODO : use extend ?
          console.log("prop = "+sourceProp+" old = "+target[sourceProp]+" new = "+args.updateWith[sourceProp]);
          target[sourceProp] = args.updateWith[sourceProp];
        });
      }
    },
    deleteModule(state, theModule) {
      let idx = state.modules.findIndex( currentModule => currentModule.dataFilename === theModule.dataFilename);
      if( idx !== -1) {
        state.modules.splice(idx, 1);
      }
    },
    selectModule(state, args) {
      let idx = state.modules.findIndex( currentModule => currentModule.dataFilename === args.dataFilename);
      if( idx !== -1) {
        state.modules[idx].selected = args.selected;
      }
    }
  }
});
