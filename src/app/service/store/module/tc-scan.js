'use strict';
/**
 * task : {
 *  "id" : "username@127.2.3.4",
 *  "step" : "INIT",
 *  "status" :  "BUSY", // IDLE | BUSY | SUCCESS | ERROR
 *   "progress" : 50, // optionnal
 *   "error" : {
 *    "message" : ""
 *   },
 *   "result" : {}
 *
 *  },
 *  "step" : [] // get tc Id, explore webapp
 * }
 * @type {"_id""}
 */

module.exports = {
  namespaced: true,
  state: {
    "tasks" : []
  },
  getters: {
    taskById : function(state, getters) {
      return function(taskId) {
        return state.tasks.find( item => item.id === taskId);
      };
    }
  },
  mutations: {
    addTask : function(state,tcScanTask) {
      state.tasks.push(tcScanTask);
    },
    deleteTask(state, taskToDelete) {
      let idx = state.tasks.findIndex( task => task.id === taskToDelete.id);
      if( idx !== -1) {
        state.tasks.splice(idx, 1);
      }
    },
    updateTask(state, options) {
      try {
        let task   = state.tasks.find(task => task.id === options.id);
        Object.assign(task, options.updateWith);
        console.log('done uodating tc scan task');
      }catch(e) {
        console.error("failed to tcScan Task",options, e);
      }
    }
  },
};
