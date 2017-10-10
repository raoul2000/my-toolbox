'use strict';

/**
 * Returns a promise that is always successful when this promise is settled.
 * Its fulfillment value is an object that implements the following interface and reflects the resolution of this promise.
 *
 * Returned object :
 * {
 *  resolved : boolean,
 *  error : Error | NULL,
 *  value : Promise resolution value | NULL
 * }
 *
 * @see http://stackoverflow.com/a/31424853/3164844
 * @param  {Promise} promise The Promise object to reflect
 * @return {Object}         the Promise reflection object describing fullfilment
 */
exports.reflect = function(promise) {
  return promise
    .then(value => {
      return {
        value: value,
        error: null,
        resolved: true
      };
    })
    .catch(error => {
      return {
        value: null,
        error: error,
        resolved: false
      };
    });
};

/**
 * Test if a Promise reflection result is resolved or not.
 *
 * @param  {object} reflectionObject see reflect
 * @return {boolean}                 True is resolved
 */
exports.isResolved = function(reflectionObject) {
  if( typeof reflectionObject === "object" && reflectionObject.hasOwnProperty('resolved')) {
    return reflectionObject.resolved;
  } else {
    throw new Error('the argument is not a reflection object');
  }
};


/**
 * Creates and return an array of functions. Each function invokes *fn* with one
 * argument from the *tasks* array and returns a Promise.
 *
 * @param  {[type]}   tasks            list of arguments used to invoke the function fn
 * @param  {Function} fn               function returning a Promise and invoked for each item in the tasks array
 * @param  {Boolean}  [withReflect=true] when TRUE, the returned Promise is never rejected (see reject)
 * @return {Array}                    Array containing functions
 */
exports.createPromiseFuncs = function (tasks, fn, withReflect = true) {
  return tasks.map( task => () =>  withReflect ? exports.reflect(fn(task)) : fn(task)  );
};

/**
 * Returns a Promise that is fullfilled when all tasks are settled.
 * Each task is executed in SEQUENCE. If the promise is resolved, its value is an array containing
 * the value or the reflect objet of each task in the sequence.
 *
 * @see https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
 * @param  {Array}   tasks list of arguments used to invoke the function fn
 * @param  {Function} fn    function returning a Promise and invoked for each item in the tasks array
 * @param  {Boolean}  [withReflect=true] when TRUE, the returned Promise is never rejected (see reject)
 * @return {Array}         Resolved Promise array (see reflec)
 */
exports.serial = function (tasks, fn, withReflect = true) {
  const funcs = exports.createPromiseFuncs(tasks,fn, withReflect);

  return funcs.reduce((promise, func) =>
    promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]));
};

/**
* Returns a Promise that is fullfilled when all tasks are settled.
* Each task is executed in PARALLEL . If the promise is resolved, its value is an array containing
* the value or the reflect objet of each task in the sequence.
*
 * @param  {[type]}   tasks list of arguments used to invoke the function fn
 * @param  {Function} fn   function returning a Promise and invoked for each item in the tasks array
 * @param  {Boolean}  [withReflect=true] when TRUE, the returned Promise is never rejected (see reject)
 * @return {[type]}         Resolved Promise array (see reflec)
 */
exports.parallel = function (tasks, fn, withReflect = true) {
  return Promise.all(
    exports.createPromiseFuncs(tasks,fn, withReflect).map( func => func() )
  );
};
