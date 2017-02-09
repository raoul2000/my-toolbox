"use strict";
const ipcRenderer = require('electron').ipcRenderer;

var codeMirror = null;
var diffCtx = {
  "src" : {
    "connection"     :  null,
    "remoteFilepath" :  null,
    "localFilepath"  : null,
    'fileContent'    : null
  },
  "trg" : {
    "connection"     :  null,
    "remoteFilepath" :  null,
    "localFilepath"  : null,
    'fileContent'    : null
  }
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

  diffCtx = {
    "src" : {
      "connection"     :  app.compareCtx.arg.src.connection,
      "remoteFilepath" :  filepath.replace(/FS/,"fs1"), // TODO : debug - replace with "filepath"
      "localFilepath"  : localSrcFilepath,
      'fileContent'    : null
    },
    "trg" : {
      "connection"     : app.compareCtx.arg.trg.connection,
      "remoteFilepath" :  filepath.replace(/FS/,"fs2"), // TODO : debug
      "localFilepath"  : localTrgFilepath,
      'fileContent'    : null
    }
  };
  app.progress.start();
  ipcRenderer.send("getRemoteFilePair.start",diffCtx);
};

/**
 * Display the diff view for the files passed as arguments
 *
 * @param  {object} fileContent description of the files to compare
 */
var renderDiffView = function(){
  // time to show the diff-view !!!
  app.showView(app.VIEW.DIFF);
  var target = document.getElementById("diff-view");
  target.innerHTML = "";

  codeMirror = CodeMirror.MergeView(target, {
    value: diffCtx.trg.fileContent, // target
    orig: null,
    origLeft: diffCtx.src.fileContent,  // source
    lineNumbers: true,
    mode: "text/html",
    highlightDifferences: true,
    connect: null,
    collapseIdentical: false
  });
};

////////////////////////////////////////////////////////////////////////////////


// for test only
document.getElementById('btn-test-winnmerge').addEventListener('click',function(event){
  ipcRenderer.send('compareExternal.start');
});

/**
 * Display the built-in diff view
 */
document.getElementById('btn-show-result').addEventListener('click',function(event){
  app.showView(app.VIEW.RESULT);
});

/**
 * Save the target to its remote location only if it has been modified
 */
document.getElementById('btn-save-changes').addEventListener('click',function(evnt){
 if(codeMirror && codeMirror.edit.isClean() === false) {
   // the target document has been modified
   if(confirm('save changes ?')) {
     diffCtx.trg.fileContent =  codeMirror.edit.getValue();
     diffCtx.trg.updateContent = true;
     ipcRenderer.send('putLocalFile.start',diffCtx.trg);
   }
 } else {
   app.alert('the Target has not been modified');
 }
});

ipcRenderer.on('putLocalFile.end',function(event){
  app.alert("target file saved successfully");
  app.showView(app.VIEW.RESULT);
});

ipcRenderer.on('putLocalFile.error',function(event){
  app.error.show("Failed to save the target to its remote location","sorry !! : ");
});
//////////////////////////////////////////////////////////////////////
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
ipcRenderer.on('getRemoteFilePair.end',function(event, fileContent){
  app.progress.end();
  diffCtx.src.fileContent = fileContent.src;
  diffCtx.trg.fileContent = fileContent.trg;

  if(app.config.diffTool.external) {
    ipcRenderer.send('compareExternal.start', {
      "diffTool"  : app.config.diffTool.command,
      "leftFile"  : diffCtx.src.localFilepath,
      "rightFile" : diffCtx.trg.localFilepath
    });
  } else {
    // use internal diff view tool
    renderDiffView();
  }
});
/**
 * Get Remote file START
 */
document.getElementById('result-compare').addEventListener('click',function(event){
  if( ! event.target.dataset.hasOwnProperty('filepath')){
    console.error("missing filepath in target dataset");
  } else {
    getRemoteFilePair(event.target.dataset.filepath);
  }
});
