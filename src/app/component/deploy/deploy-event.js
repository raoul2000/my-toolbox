const store    = require('../../service/store/store');
const EventEmitter = require('events');

class DeployEventEmitter extends EventEmitter {}

exports.createDeploymentObserver = function(module) {
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
