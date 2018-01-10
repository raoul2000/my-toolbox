'use strict';
/**
 * view : {
 *  "id" : "webapp",
 *
 * }
 */

module.exports = {
  namespaced: true,
  state: {
    "views" : []
  },
  getters: {
    viewById : function(state, getters) {
      return function(viewId) {
        return state.views.find( item => item.id === viewId);
      };
    }
  },
  mutations: {
    addView : function(state,view) {
      state.views.push(view);
    },
    deleteView(state, viewToDelete) {
      let idx = state.views.findIndex( view => view.id === viewToDelete.id);
      if( idx !== -1) {
        state.views.splice(idx, 1);
      }
    },
    updateView(state, options) {
      try {
        let view   = state.views.find(view => view.id === options.id);
        Object.assign(view, options.updateWith);
        console.log('done updating view');
      }catch(e) {
        console.error("failed to update view",options, e);
      }
    }
  },
};
