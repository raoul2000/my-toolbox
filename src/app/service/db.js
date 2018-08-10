const fs = require('fs');
const path = require('path');
const config = require('./config');

let dbMetadata = null;
/** Default dbMetadata model */
let defaultDbMetadata = {
    readOnly: false
};
function getDbMetadataFilepath() {
    return path.join(config.store.get('ctdbFolderPath'), '.db-metadata');
}

function initializeDB() {
    let metadataFilePath = getDbMetadataFilepath();
    if (fs.existsSync(metadataFilePath)) {
        console.error('failed to initialize DB : a metadata file already exists');
        return false;
    } else {
        dbMetadata = defaultDbMetadata;
        fs.writeFileSync(metadataFilePath, JSON.stringify(dbMetadata, null, 2));
        return true;
    }
}

/**
 * Load the DB metadata info.
 * If no metadata is found, it is created with the default metadata value
 *  
 * @param {boolean} force when FALSE, metadata is not loaded if already loaded, when TRUE metadata is reloaded
 */
function loadDbMetadata(force = false) {
    if (dbMetadata === null || force === true) {
        try {
            let dbMetadataFilepath = getDbMetadataFilepath();
            if (!fs.existsSync(dbMetadataFilepath)) {
                initializeDB()
            } else {
                console.log(`loading DB metadata file from ${dbMetadataFilepath}`);
                dbMetadata = JSON.parse(fs.readFileSync(dbMetadataFilepath, "utf-8"));
                console.log(dbMetadata);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function open() {
    loadDbMetadata(true);
}
function isReadOnly() {
    loadDbMetadata();
    return dbMetadata.readOnly;
}

module.exports = {
    "open" : open,
    "isReadOnly": isReadOnly,
    "loadDbMetadata": loadDbMetadata,
    "metadata" : dbMetadata
};
