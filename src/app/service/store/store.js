

module.exports = new Vuex.Store({
  state: {
    currentRoute : null,
    desktop : [],
    webappDefinition : []
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
    }
  }
});
