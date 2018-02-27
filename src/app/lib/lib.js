'use strict';

exports.helper = require('./helper.js');

exports.smartCommand = require('./ssh/smart-command.js');
//exports.tomcatScanner = require('./tomcat-scanner/scanner.js');
exports.tomcatScanner = require('./tomcat-scanner/scan-single.js');

exports.version = {
  "type" : {
    "httpRequest" : require('./version/http-request'),
    "sshCommand"  : require('./version/ssh-command')
  },
  "extractor" : {
    "service_ui_info" : require('./version/extractor/service-ui-info'),
    "rest_api"        : require('./version/extractor/rest-api'),
    "regex"           : require('./version/extractor/regex')
  },
  "tomcat" : require('./version/tomcat'),
  "helper" : require('./helper')
};
