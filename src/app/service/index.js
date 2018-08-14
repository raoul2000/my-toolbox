'user strict';

module.exports = {
  "task"          : require('./task'),
  "persistence"   : require('./persistence'),
  "notification"  : require('./notification'),
  "config"        : require('./config'),
  "command"       : require('./command/runner'),
  "shell"         : require('./shell'),
  "ssh"           : {
    "getInfo"             : require('./ssh/get-info').getInfo,
    "clearCachedPassword" : require('./ssh/get-info').clearCachedPassword,
    "checkConnection"     : require('./ssh/check-connection').checkConnection
  },
  "store"         : require('./store/store'),
  "nexus"         : {
    "browse"              : require('./nexus/browse'),
    "download"            : require('./nexus/download')
  },
  "ui"            : require('./ui'),
  "secret"        : require('../lib/encrypt'),
  "toolbar"       : require('./toolbar'),
  "db"            : require('./db'),
  "tomcat"        : require('./tomcat'),
  "prime"         : require('./prime-launcher'),
  "entities"      : require('./entities')
};
