
module.exports = new Vuex.Store({
  strict: true, // TODO : DEV only
  state: {
    desktopLoadedOnInit : false,
    currentRoute     : null,
    selectedDesktopItemIndex : null,
    desktop          : [],
    webappDefinition : [],
    modules          : [],
    tasks            : []
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
    desktopItemIndexByFilename : function(state, getters) {
      return function(filename) {
        return state.desktop.findIndex( item => item.filename === filename);
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
    },
    findTaskById : function(state, getters) {
      return function(taskId) {
        return state.tasks.find( task => task.id === taskId);
      };
    }
  },
  mutations: {
    desktopLoaded(state) {
      state.desktopLoadedOnInit = true;
    },
    setWebAppDefinition(state, definition) {
      state.webappDefinition = definition;
    },
    setCurrentRoute(state, route) {
      state.currentRoute = route;
    },
    increment (state) {
      state.count++;
    },
    ////////////////////////////////////////////////////////////////////////////
    // DESKTOP ITEMS

    addToDesktop ( state, item) {
      state.desktop.push(item);
    },
    removeFromDesktop (state, index) {
      state.desktop.splice(index, 1);
    },

    updateDesktopItem ( state, args) {
      let itemToUpdate = state.desktop.find( currentItem => currentItem.filename === args.filename);
      if( itemToUpdate ) {
        if( args.selector === 'ssh') {
          Object.assign(itemToUpdate.data.ssh, args.updateWith);
        } else  {
          Object.assign(itemToUpdate.data, args.updateWith);
        }
      }
    },
    ////////////////////////////////////////////////////////////////////////////
    // MODULE
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
     * args : {
     *  dataFilename : "...",
     *  updateWith : {
     *    "propName1" : "propValue1",
     *    "propName2" : [1,2,3],
     *    etc ...
     *  }
     * }
     * @param  {[type]} state       [description]
     * @param  {[type]} args [description]
     */
    updateModule(state, args ) {
      let modToUpdate = state.modules.find( currentModule => currentModule.dataFilename === args.dataFilename);
      if( modToUpdate ) {
        Object.assign(modToUpdate, args.updateWith);
      }
    },
    updateModuleMeta(state, args) {
      let modToUpdate = state.modules.find( currentModule => currentModule.dataFilename === args.dataFilename);
      if( modToUpdate ) {
        Object.assign(modToUpdate.metadata, args.updateWith);
      }
    },
    ////////////////////////////////////////////////////////////////////////////
    // TASKS
    addTask(state, task) {
      state.tasks.push(task);
    },
    updateTask(state,freshTask) {
      console.log('store : updating task',freshTask);
      let taskIdx = state.tasks.findIndex( task => task.id === freshTask.id);
      if( taskIdx !== -1) {
        let objToUpdate = state.tasks[taskIdx];
        let freshProperties = freshTask.updateWith;
        Object.assign(objToUpdate, freshProperties);
      }
    },
    deleteTask(state, taskToDelete) {
      let idx = state.tasks.findIndex( task => task.id === taskToDelete.id);
      if( idx !== -1) {
        state.tasks.splice(idx, 1);
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
