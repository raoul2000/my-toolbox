const store    = require('../../../service/store/store');
const EventEmitter = require('events');

class DownloadObserver extends EventEmitter {}

exports.create = function(taskId) {
  let emitter = new DownloadObserver();
  emitter
  .on("progress", (percent)=> {
    store.commit('updateTask', {
      id : taskId,
      updateWith   : {
        "status"   : "started", // "started", "done"
        "progress" : percent
      }
    });
  })
  .on('success', () => {
    store.commit('updateTask', {
      id : taskId,
      updateWith   : {
        status   : "success",
        busy     : false,
        step     : "deploy-success",
        progress : 100
      }
    });
  })
  .on('error', (error) => {
    store.commit('updateTask', {
      id : taskId,
      updateWith   : {
        status   : "error"
      }
    });
  });
  return emitter;
};
