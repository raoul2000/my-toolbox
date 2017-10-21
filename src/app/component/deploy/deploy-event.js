const store    = require('../../service/store/store');
const EventEmitter = require('events');

class DeployEventEmitter extends EventEmitter {}

exports.createEventEmitter = function(module) {
  let emitter = new DeployEventEmitter();
  emitter
  .on("connect", () => {
    store.commit("updateModule",{
      dataFilename : module.dataFilename,
      updateWith   : {
        status   : "deploying",
        busy     : true,
        step     : "connecting",
        progress : 0
      }
    });
  })
  .on("upload-progress", (percent)=> {
    store.commit('updateModule', {
      dataFilename : module.dataFilename,
      updateWith   : {
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
        status   : "success",
        busy     : false,
        step     : "",
        progress : 100
      }
    });
  })
  .on('error', (error) => {
    store.commit('updateModule', {
      dataFilename : module.dataFilename,
      updateWith   : {
        status   : "error",
        busy     : false,
        step     : "",
        progress : -1
      }
    });
  });
  return emitter;
};
