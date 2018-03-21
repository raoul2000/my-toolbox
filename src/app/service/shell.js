"use strict";

const shell = require('electron').shell;

exports.openExternal = function(url) {
  shell.openExternal(url);
};
