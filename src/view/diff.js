"use strict";
const ipcRenderer = require('electron').ipcRenderer;

var codeMirror = null;
var diffCtx = null;
/**
 * Display the diff view
 */
 document.getElementById('btn-show-result').addEventListener('click',function(event){
   app.showView(app.VIEW.RESULT);
 });

 document.getElementById('btn-save-changes').addEventListener('click',function(evnt){
   if(codeMirror && codeMirror.edit.isClean() === false) {
     // the target document has been modified
     if(confirm('save changes ?')) {
       diffCtx.trg.fileContent =  codeMirror.edit.getValue();
       diffCtx.trg.updateContent = true;
       ipcRenderer.send('putLocalFile.start',diffCtx.trg);
     }
   }
 });

document.getElementById('result-compare').addEventListener('click',function(event){
  if( ! event.target.dataset.hasOwnProperty('filepath')){
    console.error("missing filepath in target dataset");
    return;
  }
  const filepath = event.target.dataset.filepath;
  console.log("view diff on file : "+filepath);

// TODO : WIP
  var localSrcFilepath = "c:/tmp/srcf1.txt";
  var localTrgFilepath = "c:/tmp/trgf1.txt";

  diffCtx = {
    "src" : {
      "connection" :  app.compareCtx.arg.src.connection,
      "remoteFilepath" :  filepath.replace(/FS/,"fs1"), // TODO : debug
      "localFilepath" : localSrcFilepath,
      'fileContent' : null
    },
    "trg" : {
      "connection" : app.compareCtx.arg.trg.connection,
      "remoteFilepath" :  filepath.replace(/FS/,"fs2"), // TODO : debug
      "localFilepath" : localTrgFilepath,
      'fileContent' : null
    }
  };

  ipcRenderer.on('getRemoteFilePair.progress',function(event,msg){
    app.progress.message(msg);
  });

  ipcRenderer.on('getRemoteFilePair.error',function(event,msg){
    app.error.show("Error reading file pair","sorry !! : "+msg);
  });

  ipcRenderer.on('getRemoteFilePair.end',function(event, fileContent){
    // fileContent : {
    //   src : "file source content",
    //   trg : "file target content",
    // }
    diffCtx.src.fileContent = fileContent.src;
    diffCtx.trg.fileContent = fileContent.trg;
    app.progress.end();

    console.log(fileContent);
    // time to show the diff-view !!!
    //
    //initUI(fileContent.src, fileContent.trg);
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
  });

  app.progress.start();
  ipcRenderer.send("getRemoteFilePair.start",diffCtx);
});
