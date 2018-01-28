'use strict';

module.exports = {
  namespaced: true,
  state: {
    "servers" : []
  },
  getters: {
    getById : function(state, getters) {
      return function(serverId) {
        return state.servers.find( item => item.id === serverId);
      };
    }
  },
  mutations: {
    add : function(state,server) {
      state.servers.push(server);
    },
    delete(state, serverToDelete) {
      let idx = state.servers.findIndex( server => server.id === serverToDelete.id);
      if( idx !== -1) {
        state.servers.splice(idx, 1);
      } else {
        console.wan("failed to delete object",serverToDelete);
      }
    },
    update(state, options) {
      try {
        let server  = state.servers.find(server => server.id === options.id);
        Object.assign(server, options.updateWith);
      }catch(e) {
        console.error("failed to update",options, e);
      }
    }
  },
};
