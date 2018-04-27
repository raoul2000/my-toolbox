'user strict';

const DummyTaskService = require('../dummy-task');

/**
 * The results may contains differents values retrieved using various extraction
 * methods. We must now choose the best version number and to do so, we will use the one
 * with max occurence.
 *
 * versionsResults = [
 *  { "value" : "1.2.3" },
 *  { "value" : "1.2.3" },
 *  { "error" : {.. error description} }
 * ]
 */
function findWinner(versionsResults) {
  let versionOccurency = versionsResults
    .filter( result => result.hasOwnProperty('value') && result.value.length > 0 )
    .map(result => result.value)
    .reduce((acc, curr) => (acc[curr] = ++acc[curr] || 1, acc), {});
    // versionOccurency = {
    //  "value1" : 2, // occurence
    //  "value2" : 1 // occurence
    // }
  let finalVersion = Object.keys(versionOccurency).reduce( (winner, curr) => {
    if( winner === null) { return curr;          }
    else {  return versionOccurency[curr] > versionOccurency[winner]   ?  curr  : winner;}
  },null);
  return finalVersion;
}

/**
 * create a unique task id for a given tomcat and for an version update task
 * @param  {object|string} tomcat The tomcat object to update version to
 * @return {string}        the unique task id
 */
exports.createUpdateTomcatTaskId = function(tomcat) {
  if( typeof tomcat === "object") {
    return `tc-version-${tomcat._id}`;
  } else {
    return `tc-version-${tomcat}`; // string = tomcat ID
  }
};

/**
 * Update versions for a list of tomcats.
 * This method is creating fake "update tomcat version" tasks for each tomcat. This is
 * used to update component state related to tomcat version task.
 * The actual task is with type "update-tomcat-version-batch"
 *
 * Note that the advantage of a "update-tomcat-version-batch" is that it only opens
 * one SSH session.
 *
 * @param  {[type]} itemData  [description]
 * @param  {[type]} tomcatIds [description]
 * @return {[type]}           [description]
 */
exports.updateTomcatBatch = function(itemData, tomcatIds) {

  // Create tasks that are NOT submitted to the task service. They are only placeholder
  // to reflect that a version update task is in process for a tomcat

  let fakeTasks = tomcatIds.map( id => {
    let task = DummyTaskService.createTask(
      exports.createUpdateTomcatTaskId(id),
      "update-tomcat-version",
      {} // no input : this task is a placeholder
    );
    task.status = "BUSY";
    DummyTaskService.addTaskToStore(task);
    return task;
  });

  // this is the actual task that is submitted to the task service.

  return DummyTaskService.submitTask({
    "id"    : itemData._id,
    "type"  : "update-tomcat-version-batch",
    "input" : {
      "item"     : itemData,
      "tomcatId" : tomcatIds// internal ID (not the name)
    }
  })
  .promise
  .then( results => {
    /**
     * results = [
     *  {
     *    "id" : "123e-9987r-998",
     *    "result" : [
     *      { "value" : "7.0.17"},
     *      { "error" : ..error cause},
     *      etc...
     *    ]
     *  }, ...
     * ]
     */
    return results.map( result => {
      // delete the fake tasks : we could just update them and set the statues as SUCCESS/ERROR
      DummyTaskService.deleteTaskFromStore(exports.createUpdateTomcatTaskId(result.tomcatId));
      return {
        "tomcatId" : result.tomcatId,
        "version"  : findWinner(result.result)
      };
    });
  });
};

/**
 * Entry point to update version of a tomcat instance.
 *
 * @param  {object} itemData a desktop item data instance
 * @param  {string} tomcatId the id of the tomcat to update
 * @param  {object} nodessh  an optional nodessh instance
 * @return {Promise}
 */
 function updateTomcat(itemData, tomcatId) {

    // find the tomcat object intance
    let tomcat = itemData.tomcats.find( tomcat => tomcat._id === tomcatId);
    if( ! tomcat ) {
      return Promise.reject(`tomcat not found : id = ${tomcatId}`);
    }

    let taskId = exports.createUpdateTomcatTaskId(tomcat);

    return DummyTaskService.submitTask({
      "id"    : taskId,
      "type"  : "update-tomcat-version",
      "input" : {
        "item"       : itemData,
        "tomcatId"   : tomcat._id // internal ID (not the name)
      }
    })
    .promise
    .then( results => {
      return findWinner(results);
    });
}

exports.updateTomcat = updateTomcat;
