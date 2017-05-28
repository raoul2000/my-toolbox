'use strict';
const electron = require('electron');
const Conf = require('conf');

const config = new Conf({
  defaults : {
    nexus : {
      downloadFolder : (electron.app || electron.remote.app).getPath('userData')
    }
  }
});

exports.config = config;
