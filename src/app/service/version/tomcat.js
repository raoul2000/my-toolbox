'user strict';

const store = require('../store/store');
const EventEmitter = require('events');

function addTask(taskId) {
  this.$store.commit('tmptask/addTask',{
    "id"           : taskId,
    "step"         : "UPDATE",
    "status"       : "PROGRESS",
    "result"       : null,
    "errorMessage" : ""
  });
}


class VersionExtractorEmitter extends EventEmitter {}
exports.update = function(itemData, id) {

};
/**
 * options : {
 *  "taskId" : "123235545DSG2",
 *  "store"  : Store, // optional - the vuex store instance
 *
 * }
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.updateAll = function(itemData) {


  /*
  if( ! options.taskId ) {
    throw new Error('missing property : taskId');
  }

  let eventEmitter = new VersionExtractorEmitter();
  if( options.store ) {
    addTask(options.taskId);
    eventEmitter.emit('add-task', { "id" : options.taskId});
  }

  getVersionPromise()
  .then( result => {

    eventEmitter.emit("update-version",{ "result" : "version"})
  })
  .catch(err => {
    eventEmitter.emit("error",{ "result" : "version"})
  });


  return eventEmitter;
  */
};
