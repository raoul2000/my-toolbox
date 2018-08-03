"use strict";

const config = require('./config');
const secret = require('../lib/encrypt');
const runExt   = require('../lib/run-external').run;

/**
 * Execute an external command as configured in the configuration file.
 * 
 * Example of external command configuration entry : 
 * ```
{
    "id": "putty",
    "label": "Putty",
    "icon": "fa fa-terminal",
    "command": "\"C:\\Program Files\\PuTTY\\putty.exe\" -ssh -l {{USERNAME}} -pw {{PASSWORD}} -P {{PORT}} {{HOST}}",
    "description": "opens an SSH terminal with the server"
}
 * ```
 * @param {string} actionId  id of the action to run
 * @param {object} sshConnectionParams  SSH connection settings. If the password is encrypted, it will
 * be decrypted by this function before being used in variable interpolation
 */
exports.runExternalAction = function(actionId, sshConnectionParams) {
    let action = config.store.get('toolbar').find( action => action.id === actionId);
    if(action) {
      runExt(action.command, {
        "PORT"     : sshConnectionParams.port,
        "HOST"     : sshConnectionParams.host,
        "USERNAME" : sshConnectionParams.username,
        "PASSWORD" : secret.decrypt(sshConnectionParams.password)
      })
      .catch( (err) => {
        console.error(err);
        service.notification.error(
          `failed to run ${action.label}`
        );
      });        
    }
};