"use strict";

const NodeSSH = require('node-ssh');

/**
 * Parses the string passed as argument into an hash object where property is the entity name
 * and value the entity value.
 * Example :
 * {
 * 		'ENTITY_1' : 'value entity1',
 * 		'ENTITY_2' : 'another value'
 * }
 *
 * The data string must be formatted with one entity definition per line.
 * Example :
 * <!ENTITY METHENV "dev">\n
 * <!ENTITY SERVER_IP "127.0.0.1">\n
 *
 */
function eomvarParser (data, obj ){

	var eomvarEntities = obj || {};

	var arStr = data.split("\n");

	for (var idx = 0; idx < arStr.length; idx++) {
		var elt = arStr[idx];
		var match = /^<!ENTITY[\t ]+([0-9a-zA-Z_]+)+[\t ]+"(.+)">$/.exec(elt);
		if(match !== null) {
			var entityName  = match[1];
			var entityValue = match[2];
			eomvarEntities[entityName] = entityValue;
		}
	}
	return eomvarEntities;
}

exports.getEntities = function(ssh) {
  let cmd = "cat ./cfg/eomvar.dtd  ./cfg/hosts.dtd  ./cfg/emivar.dtd | grep '<!ENTITY '";

  return ssh.execCommand(cmd,{  stream: 'stdout' })
  .then( result => {
    return eomvarParser(result.stdout);
  });
};
