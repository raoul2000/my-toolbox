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
