'user strict';

const lib         = require('../../lib/lib');

/**
 * Choose the best result among a list of results.
 * The winner is the value that has more occurencies in the passed array. Following
 * array items are ignored :
 * - unresolved promises
 * - NULL values
 * - empty string values
 *
 * results = [
 *  {
 *    "error"    : Error | null,
 *    "resolved" : boolean,
 *    "value"    : string
 *   },
 *   etc ...
 * ]
 * @param  {[promiseUtilResult]} results [description]
 * @return {string | NULL}         the winner or NULL if not winner was found
 */
exports.chooseBestResultValue = function( results ) {
  return lib.helper.maxOccurenceCountValue(
    results
      .filter(result  => result.resolved && result.value !== null && result.value.length !== 0)
      .map( result    => result.value)
  ).value;
};
