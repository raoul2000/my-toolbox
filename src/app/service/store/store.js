


// Generic object to access desktop items, tomcats and webapps. Returns
// the obejct instance or the array index.
let find = {
  "object" : {
    itemById : function(items, id) {
      return items.find( item => item.data._id === id);
    },
    tomcatById : function(tomcats, id) {
      return tomcats.find( tomcat => tomcat._id === id);
    },
    webappById : function(webapps, id) {
      return webapps.find( webapp => webapp._id === id);
    }
  },
  "index" : {
    itemById : function(items, id) {
      return items.findIndex( item => item.data._id === id);
    },
    tomcatById : function(tomcats, id) {
      return tomcats.findIndex( tomcat => tomcat._id === id);
    },
    webappById : function(webapps, id) {
      return webapps.findIndex( webapp => webapp._id === id);
    }
  }
};

// THE STORE //////////////////////////////////////////////////////////////////

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
    // TODO : remove this method when not used anymore
    desktopItemByIndex : function(state, getters) {
      return function(index) {
        return state.desktop[index];
      };
    },
    desktopItemById : function(state, getters) {
      return function(id) {
        return find.object.itemById(state.desktop, id);
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
    },

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
    /*
    removeFromDesktop (state, index) {
      state.desktop.splice(index, 1);
    },*/
    removeFromDesktopById (state, id) {
      let itemIndex = find.index.itemById(state.desktop, id);
      if( itemIndex !== -1 ) {
        state.desktop.splice(itemIndex, 1);
      }
    },

    updateDesktopItem ( state, args) {
      let itemToUpdate = find.object.itemById(state.desktop, args.id);
      if( itemToUpdate ) {
        if( args.selector === 'ssh') {
          Object.assign(itemToUpdate.data.ssh, args.updateWith);
        } else  {
          Object.assign(itemToUpdate.data, args.updateWith);
        }
      }
    },

    /**
     * Add a Tomcat object to an item.
     * args : {
     *  item : { // the item object to update},
     *  tomcat : { // the tomcat instance }
     * }
     * @param {Object} state current store state
     * @param {Object} args  the argument
     */
    addTomcat(state, options) {
      try {
        let item   = find.object.itemById(state.desktop, options.item.data._id);
        item.data.tomcats = [options.tomcat].concat(item.data.tomcats);
      }catch(e) {
        console.error("failed to addTomcat",options, e);
      }
    },
    updateTomcat(state, options ) {
      try {
        let item   = find.object.itemById(state.desktop, options.item.data._id);
        let tomcat = find.object.tomcatById(item.data.tomcats, options.tomcat._id);
        Object.assign(tomcat, options.updateWith);
      }catch(e) {
        console.error("failed to updateTomcat",options, e);
      }
    },
    addWebapp(state, options) {
      try {
        let item   = find.object.itemById(state.desktop, options.item.data._id);
        let tomcat = find.object.tomcatById(item.data.tomcats, options.tomcat._id);
        tomcat.webapps = [options.webapp].concat(tomcat.webapps);
      }catch(e) {
        console.error("failed to addWebapp",options, e);
      }
    },
    updateWebapp(state, options) {
      try {
        let item   = find.object.itemById(state.desktop, options.item.data._id);
        let tomcat = find.object.tomcatById(item.data.tomcats, options.tomcat._id);
        let webapp = find.object.webappById(tomcat.webapps, options.webapp._id);
        Object.assign(webapp, options.updateWith);
      }catch(e) {
        console.error("failed to updateWebapp",e);
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
