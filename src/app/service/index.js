'user strict';

module.exports = {
  "task"          : require('./task'),
  "persistence"   : require('./persistence'),
  "notification"  : require('./notification'),
  "config"        : require('./config'),
  "command"       : require('./command/runner'),
  //"sshInfo"       : require('./ssh-connection'),
  "shell"         : require('./shell'),
  "ssh"           : {
    "getInfo"             : require('./ssh/get-info').getInfo,
    "clearCachedPassword" : require('./ssh/get-info').clearCachedPassword,
    "checkConnection"     : require('./ssh/check-connection').checkConnection
  },
  "store" : require('./store/store')
};
