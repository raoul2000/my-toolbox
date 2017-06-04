
"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const main_list = require('./main/main-list');
const deploy    = require('./main/deploy');



ipcMain.on('core-open-url',function(event,url){
  electron.shell.openItem(url);
});
