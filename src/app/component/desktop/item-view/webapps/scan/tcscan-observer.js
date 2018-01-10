const store    = require('../../../service/store/store');
const EventEmitter = require('events');

class TCScanObserver extends EventEmitter {}

exports.create = function(taskId) {
  let emitter = new TCScanObserver();
  emitter
  .on("connect", (percent)=> {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "connect",
        "busy"     : true
      }
    });
  })
  .on("progress", (percent)=> {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "downloading", // "started", "done"
        "busy"     : true,
        "progress" : percent
      }
    });
  })
  .on('success', () => {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "success",
        "progress" : 100,
        "busy"     : false
      }
    });
  })
  .on('abort', () => {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "abort",
        "busy"     : false
      }
    });
  })
  .on('error', (error) => {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "error",
        "busy"     : false,
        "error"    : error
      }
    });
  });
  return emitter;
};
