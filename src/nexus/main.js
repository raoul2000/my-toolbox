"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const main_list = require('./main/main-list');
const deploy = require('./main/deploy');
const deploy_ansible = require('./main/deploy-ansible');
const deploy_ssh = require('./main/deploy-ssh');

ipcMain.on('core-open-url', function(event, url) {
  electron.shell.openItem(url);
});
