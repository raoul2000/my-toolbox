const store    = require('../../../service/store/store');
const EventEmitter = require('events');

/**
 * The DownloadObserver implements a relation between the task (stored in the store)
 * and the actual execution of the task implemented by the nexus-Downloader.
 *
 * The nexus-Downloader perform download actions and notify the DownloadObserver
 * who will propagates thoses event to the task state in the store.
 * 
 * @extends EventEmitter
 */
class DownloadObserver extends EventEmitter {}

exports.create = function(taskId) {
  let emitter = new DownloadObserver();
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
