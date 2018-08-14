"use strict";

const runner    = require('../lib/run-external');
const fs        = require('fs-extra');
const timestamp = require('time-stamp');

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

function createCfgFileContent(ts, template,values) {

    let contentXML = resolveTemplate(template,values);
    let result = 
`<?xml version="1.0" encoding="ISO-8859-1"?>
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
   "cmd"      : "prime.exe",
   "template" : '<methodeDomain name="ENV_DEV1" secureLogin="no"> etc...',
   "values"   : {
       "VAR_NAME1" : "VALUE_1",
       "VAR_NAME2" : "VALUE_2",
       "VAR_NAME3" : "VALUE_3"
   }
}
 * ```
 * @param {*} options 
 */
function launchPrime(options) {
    console.log("startPrime");
 
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

module.exports = {
    "launch" : launchPrime
  };