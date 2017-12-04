'use strict';
const net = require('net');

exports.isPortNumber = function(val) {
console.log("isPortNumber");
  if( val === null || val === undefined || Number.parseInt(val) != val ) {
    return false;
  }
  let intValue = Number.parseInt(val);
  if(  intValue < 1  ) {
    return false;
  }
  return true;
};

exports.isIP = function(val) {
  // Tests if input is an IP address. Returns 0 for invalid strings,
  // returns 4 for IP version 4 addresses, and returns 6 for IP version 6 addresses.
  return net.isIP(val) !== 0;
};

exports.isNotEmptyString = function(val, trim = true) {
  if( val === null || val === undefined ) {
    return false;
  }
  if( trim ) {
    return val.trim().length !== 0;
  } else {
    return val.length !== 0;
  }
};
