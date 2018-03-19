'user strict';

exports.service = {
  "task"          : require('./task'),
  "persistence"   : require('./persistence'),
  "notification"  : require('./notification'),
  "config"        : require('./config'),
  "command"       : require('./command/runner'),
  "sshInfo"       : require('./ssh-connection')
};
