var fs         = require('fs');
var path       = require('path');
const config   = require('./config');
var Queue      = require('better-queue');

function writeFileJob(options, cb) {
  fs.writeFile(options.filePath, JSON.stringify(options.data, null, 2) , 'utf-8', (err) => {
    if(err) {
      cb(err);
    } else {
      cb(null,true);
    }
  });
}

/**
 * Using queue to avoid concurrent write access on desktop item files that could cause
 * JSON corruption
 */
const queueWriteFile = new Queue(writeFileJob,{
  "batchSize" : 1
});

/**
 * Save the Item to the a file.
 * The save request is not executed imediatelt but pushed to a queue.
 * 
 * @param  {object} item the item to save
 */
function saveDesktopItemToFile( item ) {
  let filePath = path.join(config.store.get("ctdbFolderPath"), item.filename);
  console.log("updating file "+filePath);
  queueWriteFile.push({
    "filePath" : filePath,
    "data"     : item.data
  }, (err,result) => {
    if(err) {
      console.error("failed to save file "+filePath,err);
    }
  });
}


module.exports = {
  "saveDesktopItemToFile" : saveDesktopItemToFile
};
