'use strict';
const electron = require('electron');
const Conf     = require('conf');

const config = new Conf({
  defaults : {
    nexus : {
      downloadFolder : {
        val : null,
        def : (electron.app || electron.remote.app).getPath('userData') // TODO: change to user download 
      },
      confFolder : {
        val : null,
        def : (electron.app || electron.remote.app).getPath('userData')
      }
    }
  }
});

exports.config = config;
