'use strict';
const uuidv1 = require('uuid/v1');

exports.generateUUID = function() {
    return uuidv1();
};
