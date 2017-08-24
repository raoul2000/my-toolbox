"use strict";

const Store = require('electron-store');
const store = new Store({
  "obj1": {
  "foo": {
    "bar": "def value"
  }
}
});
console.log("loading config from ", store.path);
module.exports = store;
