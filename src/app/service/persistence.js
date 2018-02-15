var fs         = require('fs');
var path       = require('path');
const config   = require('./config');

exports.saveDesktopItemToFile = function( item ) {
    let filePath = path.join(config.store.get("ctdbFolderPath"), item.filename);
    fs.writeFile(filePath, JSON.stringify(item.data, null, 2) , 'utf-8', (err) => {
      if(err) {
        console.error(err);
      }
    });
  };
