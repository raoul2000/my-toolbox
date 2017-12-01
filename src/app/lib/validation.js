'use strict';
const net = require('net');


exports.isIP = function(val) {
  // Tests if input is an IP address. Returns 0 for invalid strings,
  // returns 4 for IP version 4 addresses, and returns 6 for IP version 6 addresses.
  return net.isIP(val) !== 0;
};
