const util = require('util');
const exec = util.promisify(require('child_process').exec);


let interpolate = function(cmdTemplate, values) {
    return cmdTemplate.replace(/\{\{([a-zA-Z_0-9]*)\}\}/gm, (m, $1) => {
        if( values.hasOwnProperty($1)) {
            return values[$1];
        } else {
            return m
        }
    });
}

exports.interpolate = interpolate;

/**
 * Run an external command
 * 
 * @param {string} cmdTemplate the command template string to execute
 * @param {hash} values (optional, default = NULL) object values
 */
exports.run = function(cmdTemplate, values = null) {

    let cmd = cmdTemplate;
    if( values ) {
        cmd = interpolate(cmdTemplate, values);
    }        
    return exec(cmd);
}