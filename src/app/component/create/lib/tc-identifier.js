"use strict";

/**
 * Parses entity names and extract when possible a tomcat Id.
 * The extraction is based on a capturing regular expression.
 * The expected entity format is TOMCAT_XXXXXX_???? where XXXX is The
 * tomcat id that is extracted.
 *
 * @param obj object where key are entity name and value is entity value
 * @returns array unique tomcat ids (lower case)
 */
function extractTomcatIds(obj) {
	var tomcatIds = [];
	for(var propertyName in obj){
		if( ! obj.hasOwnProperty(propertyName)){
			continue;
		}
		var match = /^TOMCAT_([a-zA-Z0-9]+)_.*$/.exec(propertyName);
		if(match !== null) {
			var tid = match[1].toLowerCase();
			if( tomcatIds.indexOf(tid) === -1){
				tomcatIds.push(tid);
			}
		}
	}
	return tomcatIds;
}
exports.extractTomcatIds = extractTomcatIds;
