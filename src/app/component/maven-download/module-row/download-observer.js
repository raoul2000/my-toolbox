const store    = require('../../../service/store/store');
const EventEmitter = require('events');

class DownloadObserver extends EventEmitter {}

exports.create = function(taskId) {
  let emitter = new DownloadObserver();
  emitter
  .on("connect", (percent)=> {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "connect"
      }
    });
  })
  .on("progress", (percent)=> {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "downloading", // "started", "done"
        "progress" : percent
      }
    });
  })
  .on('success', () => {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "success",
        "progress" : 100
      }
    });
  })
  .on('abort', () => {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "abort"
      }
    });
  })
  .on('error', (error) => {
    store.commit('updateTask', {
      "id" : taskId,
      "updateWith"   : {
        "status"   : "error",
        "error"    : error
      }
    });
  });
  return emitter;
};
