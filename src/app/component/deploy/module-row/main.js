'use strict';

var remote = require('electron').remote;

/**
 * The Main vuesjs component
 * @type {Object}
 */
module.exports = {
  template : require('./main.html'),
  props    : ['module'],
  data     : function() {
    return {
    };
  },
  methods : {
  },
  watch: {
  }
};
