"use strict";

function allSettledInSequence0(items) {

  return items.reduce(
    (p, fn) => p.then(fn),
    Promise.resolve()
  );

/*
  for(let i = 0; i < items.length; i++) {
      const result = yield items[i];
      console.log(result);

  }
  */
}
/**
 * Sequentially execute a list of function that return Promised and when done, returns
 * an array containing one result per function.
 *
 * @param  {array} items   functions returning a Promise
 * @return {array}          result for each function
 */
function allSettledInSequence(items) {

  if( Array.isArray(items) === false) {
    throw new Error("array expected");
  }

  var allResults = [];
  var successHandler = function(nextPromise){
    return function(result) {
      if( result !== true) {  // the first result must be ignored
        allResults.push(result);
      }
      return nextPromise();
    };
  };

  var errorHandler = function(nextPromise) {
    return function(error) {
      allResults.push(error);
      return nextPromise();
    };
  };

  // start the sequential fullfilment of the Promise chain
  // The first result (true) will not be inserted in the result array, it is here
  // just to start the chain.
  var result = Promise.resolve(true);
  items.forEach(function (f) {
    result = result.then(
      successHandler(f),
      errorHandler(f)
    );
  });

  // As the last result is not handled in the forEach loop, we must handle it now
  return result.then(
      function(finalResult){
      allResults.push(finalResult);
      return allResults;
    },
    function(error) {
      allResults.push(error);
      return allResults;
  });
}
exports.allSettledInSequence = allSettledInSequence;
