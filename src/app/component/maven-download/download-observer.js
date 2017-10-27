const store    = require('../../service/store/store');
const EventEmitter = require('events');

class DownloadObserver extends EventEmitter {}

exports.create = function(downloadTask) {
  let emitter = new DownloadObserver();
  emitter
  .on("download-progress", (percent)=> {
    store.commit('updateModule', {
      dataFilename : module.dataFilename,
      updateWith   : {
        status   : "deploying",
        busy     : true,
        step     : "upload",
        progress : percent
      }
    });
  })
  .on('success', () => {
    store.commit('updateModule', {
      dataFilename : module.dataFilename,
      updateWith   : {
        status   : "idle",
        busy     : false,
        step     : "deploy-success",
        progress : 100
      }
    });
  })
  .on('error', (error) => {
    store.commit('updateModule', {
      dataFilename : module.dataFilename,
      updateWith   : {
        status   : "idel",
        busy     : false,
        step     : "deploy-error",
        progress : -1
      }
    });
  });
  return emitter;
};
