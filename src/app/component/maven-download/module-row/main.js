'use strict';

const remote   = require('electron').remote;
const fs       = require('fs');
const path     = require('path');
const store    = require('../../../service/store/store');


/**
 * The Main vuesjs component
 * @type {Object}
 */
module.exports = {
  template : require('./main.html'),
  props    : ['module'],
  data     : function() {
    return {
      "module" : this.module
    };
  },
  computed: {
  },
  methods : {
  }
};
