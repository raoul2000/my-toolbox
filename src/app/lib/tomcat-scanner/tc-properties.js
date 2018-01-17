"use strict";

/**
 *
 * Expected SSH command output :
 *
 * Server version: Apache Tomcat/6.0.36
 * Server built:   Oct 16 2012 09:59:09
 * Server number:  6.0.36.0
 * OS Name:        Linux
 * OS Version:     2.6.32-504.el6.x86_64
 * Architecture:   amd64
 * JVM Version:    1.7.0_25-b15
 * JVM Vendor:     Oracle Corporation
 *
 * @param  {NodeSSH} ssh             [description]
 * @param  {string} tomcatinstallDir [description]
 * @return {object}                  [description]
 */
function extractTomcatProperties(ssh, tomcatinstallDir) {

	// another option would be to invoke the script tomcatinstallDir/bin/version.sh
	var cmd = `cd ${tomcatinstallDir}; java -cp  lib/catalina.jar org.apache.catalina.util.ServerInfo`;

	return ssh.execCommand(cmd,{  stream: 'stdout' })
	.then(function(cmdOutput){
		return cmdOutput.stdout.split('\n').map(function(line){
			if(line.trim().length !== 0 ){
				return {
					'name'  : line.substring(0,16).replace(/:/,'').trim(),
					'value' : line.substring(16).trim()
				};
			}
		}).filter(item => item); // remove falsy (undefined) element
	});
}
exports.extractTomcatProperties = extractTomcatProperties;
