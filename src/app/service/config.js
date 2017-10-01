"use strict";

//var remote = require('remote');
//var app = remote.require('app');
var app = require('electron').remote.app;
// see https://github.com/sindresorhus/electron-store
const Store = require('electron-store');

const store = new Store({
  "name" : "my-toolbox",
  "defaults" : {
    "dataFolder" : app.getPath('home'),
    // 'deployFolder' : absolute path of the folder where  all the artefact files
    // candidate for deployment are stored.
    "deployFolder" : app.getPath('home')
  }
});
console.log("loading config from ", store.path);


module.exports = store;
