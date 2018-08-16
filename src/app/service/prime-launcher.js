"use strict";

const runner    = require('../lib/run-external');
const fs        = require('fs-extra');
const timestamp = require('time-stamp');
const xmlParser = require('../lib/xml/parser');

const xmldom = require('xmldom');

const targetFolderPath = "C:\\Program Files\\EidosMedia\\Methode\\cfg";
const cfgFilename      = "repositories.cfg";
const defaultCommand   = "methode.exe";


function resolveTemplate(template, values) {
    if( ! values ) {
        return template;
    } else {
        return template.replace(/\{\{([a-zA-Z_0-9]*)\}\}/gm, (m, $1) => {
            if( values.hasOwnProperty($1)) {
                return values[$1];
            } else {
                return m
            }
        });
    }
}

function resolveXMLTemplate(template, values) {

    // convert the values array into an entity name/value map
    let entities = {};
    values.forEach( val => {
        entities[val.name] = val.value;
    })

    // let's resolve entities

    let missingEntities = [];
    let strXML = xmlParser.entityResolver(template, entities, (missingEntityName) => {
        missingEntities.push(missingEntityName);
    });
    if( missingEntities.length != 0) {
        throw {
            "message" : "Following entities could not be resolved : " + missingEntities.join(', ')
        };
    }
    // we should now have an XML string ready to be parsed. Let's try
    let oDOM = new DOMParser().parseFromString(strXML, "application/xml");    

    let parserErrorNode = oDOM.querySelector('parsererror');
    if( parserErrorNode ) {
        throw {
            "message"     : "It seems that the XML is not valid.",
            "parsererror" : new XMLSerializer().serializeToString(oDOM.querySelector('parsererror > div'))
        }
    }
    return new XMLSerializer().serializeToString(oDOM);
}


function createCfgFileContent(ts, template,values) {

    //let contentXML = resolveTemplate(template,values);
    let contentXML = resolveXMLTemplate(template,values);
    let result = 
`<?xml version="1.0" encoding="UTF-8"?>
<methodeConnections>
    <!-- created by myowntoolbox (${ts})-->
    ${contentXML}
</methodeConnections>`;

    return result;
}
/**
 * options : 
 * ```json
{
   "cmd"      : "methode.exe",
   "template" : '<methodeDomain name="ENV_DEV1" secureLogin="no"> etc...',
   "values"   : [
           { "name": "VAR_NAME1", "value": "3850" },
           { "name": "VAR_NAME2", "value": "22" },
           etc ...
   ]
}
 * ```
 * @param {*} options 
 */
function launchPrime(options) {
 
    let primeCmd = options.cmd || defaultCommand;

    let ts = timestamp('YYYY-MM-DD_HHmmss');
    let strXML = createCfgFileContent(ts,options.template, options.values)
    
    let cfgFilePath = path.join(targetFolderPath, cfgFilename);      
    
    // is there already a cfg file ?
    if( fs.existsSync(cfgFilePath)) {
      // is this cfg file created by us ?
      let existingCfgFile = fs.readFileSync(cfgFilePath);
      if( existingCfgFile.lastIndexOf('<!-- created by myowntoolbox') === -1) {
        // no this file was not created by us : let's create a backup
        let cfgBackupfilePath = `${cfgFilePath}.${ts}`;
        fs.copyFileSync(cfgFilePath, cfgBackupfilePath);
      }
    }
    fs.writeFileSync(cfgFilePath,strXML);
    runner.run(primeCmd);
}


function resolveCfgTemplate(options) {
    try {
        let ts = timestamp('YYYY-MM-DD_HHmmss');
        return {
            "resolvedTemplate" : createCfgFileContent(ts,options.template, options.values)
        }
    }catch(error) {
        return {
            "error" : error
        }
    }
}

module.exports = {
    "launch" : launchPrime,
    "resolveCfgTemplate" : resolveCfgTemplate
  };