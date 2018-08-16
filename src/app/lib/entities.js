"use strict";

const lib     = require('./lib');
const NodeSSH = require('node-ssh');
const asyncUtil = require("async");

/**
 * Parses the string passed as argument into an hash object where property is the entity name
 * and value the entity value.
 * 
 * Example :
 * ```
  {
  		'ENTITY_1' : 'value entity1',
  		'ENTITY_2' : 'another value'
  }
  ```
 * The data string must be formatted with one entity definition per line.
 * 
 * Example :
 * ```
  <!ENTITY METHENV "dev">\n
  <!ENTITY SERVER_IP "127.0.0.1">\n
```  
 */
function parseEntities(inputStr) {

	var result = [];
    var arStr = inputStr.split("\n");
    let re = /^<!ENTITY[\t ]+([0-9a-zA-Z_]+)+[\t ]+"(.*)">$/;
    let match;

	for (var idx = 0; idx < arStr.length; idx++) {
        console.log('testing : ',arStr[idx]);
		match = re.exec(arStr[idx]);
		if(match !== null) {

            result.push({
                "name"  : match[1],
                "value" : match[2]
            });
            console.log(`pushing ${match[1]}:${match[2]}`);
		}
	}
	return result;    
}

function parseEnvironmentVars(inputStr) {
    let result = [];
    let lines = inputStr.split("\n");
    let re = /^[\t ]+([0-9a-zA-Z_]+)+="(.*)">$/;
    let match;
    return lines.map( line => {
        match = re.exec(line);
    });
}

/**
 * Retrieve entities from the remote server.
 * 
 * @param {object} sshConnectionSettings 
 */
function loadFromServer(sshConnectionSettings) {

    let nodessh = new NodeSSH();
    let script = `
    if [  -f ./cfg/eomvar.dtd ]; then
        cat ./cfg/eomvar.dtd
    fi    
    if [  -f ./cfg/hosts.dtd ]; then
        cat ./cfg/hosts.dtd
    fi    
    `;
    return nodessh.connect(
        lib.secret.decryptPassword(sshConnectionSettings)
    )
    .then( result => {
       return nodessh.execCommand(script,[],{stream: 'stdout'});
       //return nodessh.execCommand(`cat ./cfg/eomvar.dtd ./cfg/hosts.dtd`,[],{stream: 'stdout'});
       //return nodessh.execCommand(`cat ./cfg/env/*.vars | grep "export"`,[],{stream: 'stdout'});
    })
    .then( result => {
        console.log(result);
        nodessh.dispose();
        if( result.code === 0) {
            return parseEntities(result.stdout);
            //return parseEnvironmentVars(result.stdout);
        } else {
            return Promise.reject(result);
        }
    });
}


function loadFromServerEx(sshConnectionSettings) {

    let nodessh = new NodeSSH();
    let extractors = [
        {
            'cmd' : `if [  -f ./cfg/eomvar.dtd ]; then
                cat ./cfg/eomvar.dtd
            fi`,
            'source' : './cfg/eomvar.dtd',
            'parser' : parseEntities
        },
        {
            'cmd' : `if [  -f ./cfg/hosts.dtd ]; then
                cat ./cfg/hosts.dtd
            fi`,
            'source' : './cfg/hosts.dtd',
            'parser' : parseEntities
        },
        {
            'cmd' : `if [  -f ./cfg/emivar.dtd ]; then
                cat ./cfg/emivar.dtd
            fi`,
            'source' : './cfg/emivar.dtd',
            'parser' : parseEntities
        },
        {
            'cmd' : `env`,
            'source' : 'ENV',
            'parser' : parseEnvironmentVars
        },
    ];

    return nodessh.connect(
        lib.secret.decryptPassword(sshConnectionSettings)
    )
    .then( result => {
        let tasks = extractors.map( ext => {

            return (cb) => {
                nodessh.execCommand(ext.cmd,[],{stream : 'stdout'})
                .then( stdout => {
                    cb(null, {
                        "source" : ext.source,
                        "values" : ext.parser(stdout)
                    });
                })
                .catch( error => { cb(error);})
            }
        });
        return asyncUtil.seq(tasks);
    })
    .then( result => {
        console.log(result);
        nodessh.dispose();
        return result;
    })
    .catch( error => {
        console.log(error);
        nodessh.dispose();
    });
}

module.exports = {
  "loadFromServer" : loadFromServer
};