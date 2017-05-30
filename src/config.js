'use strict';
const electron = require('electron');
const Conf     = require('conf');

// Default Config (Read only) /////////////////////////////////////////////////
//
const defaultConfig = {
  'nexus.downloadFolder' : (electron.app || electron.remote.app).getPath('downloads'),
  'nexus.confFolder'     : (electron.app || electron.remote.app).getPath('userData')
};
const getdefaultConfig = function(key) {
  return defaultConfig[key];
};

exports.defaultConfig = {
  get : getdefaultConfig
};

// user Config (read/write) ///////////////////////////////////////////////////
const userConfig = new Conf({
  defaults : {
    nexus : {
      downloadFolder : null,
      confFolder     : null
    }
  }
});

exports.userConfig = userConfig;

// safe Config Reader //////////////////////////////////////////////////////////
//
exports.config = {
  get : function(key) {
    return userConfig.get(key, getdefaultConfig(key));
  }
};
