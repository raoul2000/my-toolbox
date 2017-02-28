"use strict";
const ipcRenderer = require('electron').ipcRenderer;

var diffCtx = {
  "src" : {
    "connection"     : null,
    "remoteFilepath" : null,
    "localFilepath"  : null,
    'fileContent'    : null,
    'modified'       : false  // TRUE : local and  remote copies have different content
  },
  "trg" : {
    "connection"     : null,
    "remoteFilepath" : null,
    "localFilepath"  : null,
    'fileContent'    : null,
    'modified'       : false  // TRUE : local and  remote copies have different content
  },
  "filesMatch" : false
};

////////////////////////////////////////////////////////////////////////////////

/**
* Initiates the Get Remote File pair action.
*
 * @param  {string} filepath remote filepath to get
 */
var getRemoteFilePair = function(filepath) {
  console.log("view diff on file : "+filepath);

  // TODO : WIP
  var localSrcFilepath = "c:/tmp/srcf1.txt";
  var localTrgFilepath = "c:/tmp/trgf1.txt";
  console.log(getRemoteFilePair);
  diffCtx = {
    "src" : {
      "connection"     : app.ctx.src.connection,
      "remoteFilepath" : filepath.replace(/FS/,"fs1"), // TODO : debug - replace with "filepath"
      "localFilepath"  : localSrcFilepath,
      'fileContent'    : null,
      'modified'       : false
    },
    "trg" : {
      "connection"     : app.ctx.trg.connection,
      "remoteFilepath" : filepath.replace(/FS/,"fs2"), // TODO : debug
      "localFilepath"  : localTrgFilepath,
      'fileContent'    : null,
      'modified'       : false
    }
  };
  app.progress.start();
  ipcRenderer.send("getRemoteFilePair.start",diffCtx);
};

////////////////////////////////////////////////////////////////////////////////
/**
 * Get Remote file PROGRESS
 */
ipcRenderer.on('getRemoteFilePair.progress',function(event,msg){
  app.progress.message(msg);
});

/**
 * Get Remote file ERROR
 */
ipcRenderer.on('getRemoteFilePair.error',function(event,msg){
  app.error.show("Error reading file pair","sorry !! : "+msg);
});
/**
 * Get Remote file END
 */
ipcRenderer.on('getRemoteFilePair.end',function(event, result){
  console.log("## getRemoteFilePair.end");
  console.log(result);

  app.progress.end();

  diffCtx.src.fileContent   = result.src.content;
  diffCtx.src.localFilepath = result.src.localFilepath;
  diffCtx.src.modified      = false;

  diffCtx.trg.fileContent   = result.trg.content;
  diffCtx.trg.localFilepath = result.trg.localFilepath;
  diffCtx.trg.modified      = false;

  app.progress.start();
  app.progress.message("merging in progress ...");

  ipcRenderer.send('merge.start', {
    "diffTool"  : app.config.diffTool.command,
    "ctx"       : diffCtx
  });

});

/**
 * Comparaison using the external program is done
 * Copy local file to remote host if needed by calling putLocalFilePair
 *
 */
ipcRenderer.on('merge.end',function(event,result){
  console.log("## merge.end");
  console.log(result);

  diffCtx.src.modified = result.srcModified;
  diffCtx.trg.modified = result.trgModified;
  diffCtx.filesMatch   = result.filesMatch;

  if( diffCtx.src.modified || diffCtx.trg.modified) {
    ipcRenderer.send('putLocalFilePair.start',diffCtx);
    app.progress.message("updating remote files");
  } else {
    app.progress.end();
    app.showView(app.VIEW.RESULT);
  }
});

ipcRenderer.on('putLocalFilePair.progress',function(event, remoteFilepath){
  app.progress.message("file :  "+remoteFilepath);
});

ipcRenderer.on('putLocalFilePair.end',function(event, arg){
  console.log("# putLocalFilePair.end");
  diffCtx.src.modified = false;
  diffCtx.trg.modified = false;

  // TODO : debug only
  var devFilename = diffCtx.src.remoteFilepath.replace(/fs1/,"FS");

  $('tr[data-filepath="'+devFilename+'"]')
    .removeClass()
    .addClass(diffCtx.filesMatch === true ? 'state-cmp-ok' : 'state-cmp-diff');

  app.progress.end();
  app.showView(app.VIEW.RESULT);
});


ipcRenderer.on('putLocalFilePair.error',function(event, arg, error){
  app.error.show("Failed to save file to its remote location : "+arg.remoteFilepath,"sorry !! : ");
});


/**
 * Get Remote file START
 */
document.getElementById('result-compare').addEventListener('click',function(event){
  console.log('result-compare');
  if( ! event.target.dataset.hasOwnProperty('filepath')){
    console.error("missing filepath in target dataset");
  } else {
    if(event.target.classList.contains('view-diff')) {
      getRemoteFilePair(event.target.dataset.filepath);
    }else if(event.target.classList.contains('refresh-diff') ){
      // do something
      ipcRenderer.send('refreshSingleFileResult.start',{
        'filepath' : event.target.dataset.filepath,
        'src'      : diffCtx.src,
        'trg'      : diffCtx.trg
      });
    }
  }
});
