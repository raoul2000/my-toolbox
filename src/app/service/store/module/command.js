'use strict';
/**
 * Store the command library loaded from file
 * command : {
 *  _id : "5545454654",
 *  "name" : "list",
 *  "source" : "ls -rtl"
 * }
 */

module.exports = {
  namespaced: true,
  state: {
    "commands" : []
  },
  getters: {
    commandById : function(state, getters) {
      return function(commandId) {
        return state.commands.find( cmd => cmd.id === commandId);
      };
    }
  },
  mutations: {
    add : function(state,command) {
      state.commands.push(command);
    },
    delete(state, commandToDelete) {
      let idx = state.commands.findIndex( cmd => cmd.id === commandToDelete.id);
      if( idx !== -1) {
        state.commands.splice(idx, 1);
      }
    },
    update(state, options) {
      try {
        let cmd   = state.commands.find(cmd => cmd.id === options.id);
        Object.assign(cmd, options.updateWith);
        console.log('done updating command');
      }catch(e) {
        console.error("failed to update command",options, e);
      }
    }
  },
};
