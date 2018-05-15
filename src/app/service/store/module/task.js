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
    "tasks" : []
  },
  getters: {
    taskById : function(state, getters) {
      return function(taskId) {
        return state.tasks.find( item => item.id === taskId);
      };
    },
    tasksByType : function(state, getters) {
      return function(type) {
        return state.tasks.filter( item => item.type === type);
      };
    }
  },
  mutations: {
    addTask : function(state,newTask) {
      if ( state.tasks.findIndex( task => task.id === newTask.id) !== -1) {
        throw new Error("Add Task failed : duplicate id : "+newTask.id);
      }
      state.tasks.push(newTask);
    },
    deleteTask(state, taskToDelete) {
      let idx = state.tasks.findIndex( task => task.id === taskToDelete.id);
      if( idx !== -1) {
        state.tasks.splice(idx, 1);
      }
    },
    deleteTaskById(state, taskId) {
      let idx = state.tasks.findIndex( task => task.id === taskId);
      if( idx !== -1) {
        state.tasks.splice(idx, 1);
      }
    },
    updateTask(state, options) {
      try {
        let task   = state.tasks.find(task => task.id === options.id);
        Object.assign(task, options.updateWith);
        console.log('done updating task');
      }catch(e) {
        console.error("failed to update Task",options, e);
      }
    },
    updateTomcat(state, options) {
      try {
        let task   = state.tasks.find(task => task.id === options.taskId);
        let tomcat = task.tomcats.find( tomcat => tomcat.id === options.tomcatId);
        Object.assign(tomcat, options.updateWith);
        console.log('done uodating tomcat tc scan task');
      }catch(e) {
        console.error("failed to update tomcat tcScan Task",options, e);
      }
    }
  },
};
