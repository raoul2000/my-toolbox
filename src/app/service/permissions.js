const fs = require('fs');
const path = require('path');
const config = require('./config');
const db = require('./db');

const permissions = [
    "CREATE"
];


let currentPermissions = null;

function can(permissionName) {
    let perm = getCurrentPermission();
    return perm[permissionName];
}

function hasPermission(name, meta) {
    switch(name) {
        case "CREATE":
            return meta.readOnly === true ? false : true;
        break;
        default:
            return false;
    }
}

function getCurrentPermission(force = false) {
    if( currentPermissions === null ||  force === true) {
        let meta = db.metadata;
        permissions.forEach( permName => {    
            currentPermissions[permName] = hasPermission(permName, meta);
        });
    }
    return currentPermissions;
}

module.exports = {
    "can" : can,
    "value" : permissionHash
};
