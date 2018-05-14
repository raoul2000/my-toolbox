'user strict';

exports.service = {
  "task"          : require('./task'),
  "persistence"   : require('./persistence'),
  "notification"  : require('./notification'),
  "config"        : require('./config'),
  "command"       : require('./command/runner'),
  "sshInfo"       : require('./ssh-connection'),
  "shell"         : require('./shell'),
  "ssh"           : {
    "getInfo"          : require('./ssh/get-info').getInfo,
    "checkConnection" : require('./ssh/check-connection').checkConnection
  }
};
