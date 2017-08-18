"use strict";

var xmlParser = require('./helper/xml-parser');

function getDOM(ssh, tomcatInstallDir, xmlEntities) {

  var cmd = `cat ${tomcatInstallDir}/conf/server.xml`;
  return ssh.execCommand(cmd,{  stream: 'stdout' })
  .then(result => {
    console.log(result);
    return xmlParser.parse(result.stdout, xmlEntities);
  });
}

exports.getDOM = getDOM;


function getPortNumberByProtocol(dom, protocol) {
  var connectorList = dom.getElementsByTagName("Connector");
  for(var i=0; i<connectorList.length; i ++) {
    if( connectorList[i].getAttribute("protocol") === protocol ){
      return connectorList[i].getAttribute("port");
    }
  }
  return null;
}
exports.getPortNumberByProtocol = getPortNumberByProtocol;
