'use strict';
/**
 * task : {
 *  "id" : "username@127.2.3.4",
 *  "name" : "update-tc-version"
 *  "step" : "INIT",
 *  "status" :  "BUSY", // IDLE | BUSY | SUCCESS | ERROR
 *   "progress" : 50, // optionnal
 *   "error" : {
 *    "message" : ""
 *   },
 *   "result" : {}
 *  }
 * }
 * @type {"_id""}
 */

module.exports = {
  namespaced: true,
  state: {
    "items" : []
  },
  getters: {
    itemById : function(state, getters) {
      return function(itemId) {
        return state.items.find( item => item.id === itemId);
      };
    },
    itemsByType : function(state, getters) {
      return function(type) {
        return state.items.filter( item => item.type === type);
      };
    }
  },
  mutations: {
    addItem : function(state,item) {
      state.items.push(item);
    },
    deleteItem(state, itemToDelete) {
      let idx = state.items.findIndex( task => task.id === itemToDelete.id);
      if( idx !== -1) {
        state.items.splice(idx, 1);
      }
    },
    updateItem(state, options) {
      try {
        let itemToUpdate   = state.items.find(item => item.id === options.id);
        Object.assign(itemToUpdate, options.updateWith);
      }catch(e) {
        console.error("failed to update Item ",options, e);
      }
    }
  }
};
