'use strict';
const uuidv1 = require('uuid/v1');

exports.generateUUID = function() {
    return uuidv1();
};
/**
 * [groupBy description]
 * @see https://stackoverflow.com/questions/14446511/what-is-the-most-efficient-method-to-groupby-on-a-javascript-array-of-objects
 * @param  {[objects]} list      [description]
 * @param  {[type]} keyGetter [description]
 * @return {[type]}           [description]
 */
exports.groupBy = function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
};

exports.maxOccurenceCountValue = function(values) {
  if( ! Array.isArray(values)) {
    throw new Error('failed to find maxOccurence : array must be provided');
  }
  let winner = {
    "value" : null,
    "count" : 0
  };

  const valueSet = new Set(values);// remove duplicates
  if( valueSet.size === 1) {
    winner.value = valueSet.values().next().value;
    winner.count = 1;
  } else if( valueSet.size !== 0 ){
    let valueOccurence = new Map();
    values.forEach(value => {
      if( valueOccurence.has(value)) {
        valueOccurence.set(value, valueOccurence.get(value) + 1);
      } else {
        valueOccurence.set(value, 1);
      }
    });

    valueOccurence.forEach( (count, value ) => {
      if( count > winner.count) {
        winner.value = value;
        winner.count = count;
      }
    });
  }
  console.log("value winner : ",winner);
  return winner;
};
