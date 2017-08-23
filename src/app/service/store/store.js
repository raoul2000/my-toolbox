

module.exports = new Vuex.Store({
  state: {
    desktop : []
  },
  mutations: {
    increment (state) {
      state.count++;
    },
    addToDesktop ( state, item) {
      state.desktop.push(item);
    },
    removeFromDesktop1 (state, item) {
      for(var i = 0; i< state.desktop.length; i++ ){
      	if (state.desktop[i].data.name === item.data.name) {
          state.desktop.splice(i, 1);
          break;
        }
      }
    },
    removeFromDesktop (state, index) {
      state.desktop.splice(index, 1);
    }
  }
});
