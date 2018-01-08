'use strict';
/**
 * task : {
 *  "_id" : "11233654",
 *  "step" : "INIT",
 *  "status" : {
 *      "name" : "status_name",
 *      ["progress" : 50]
 *  },
 *  "step" : [] // get tc Id, explore webapp
 * }
 * @type {"_id""}
 */

exports = {
  namespaced: true,
  state: {
    "someProp" : 1
  },
  getters: {
    taskById : function(state, getters) {
      return function(webappId) {
        console.log('taskById');
        return {};
      };
    },

  },
  mutations: {},
};
