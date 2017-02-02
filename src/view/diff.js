"use strict";
const ipcRenderer = require('electron').ipcRenderer;

var  dv = null;
/**
 * Display the diff view
 */
 document.getElementById('btn-show-result').addEventListener('click',function(event){
   showView(VIEW.RESULT);
 });

 document.getElementById('btnt-save-changes').addEventListener('click',function(evnt){

 });

document.getElementById('result-compare').addEventListener('click',function(event){
  if( ! event.target.dataset.hasOwnProperty('filepath')){
    return;
  }
  const filepath = event.target.dataset.filepath;
  console.log("view diff on file : "+filepath);

// TODO : WIP
  var localSrcFilepath = "c:/tmp/srcf1.txt";
  var localTrgFilepath = "c:/tmp/trgf1.txt";

  var arg = {
    "src" : {
      "connection" :  compareCtx.arg.src.connection,
      "remoteFilepath" :  filepath.replace(/FS/,"fs1"), // TODO : debug
      "localFilepath" : localSrcFilepath,
      'fileContent' : null
    },
    "trg" : {
      "connection" : compareCtx.arg.trg.connection,
      "remoteFilepath" :  filepath.replace(/FS/,"fs2"), // TODO : debug
      "localFilepath" : localTrgFilepath,
      'fileContent' : null
    }
  };

  ipcRenderer.on('getRemoteFilePair.end',function(event, fileContent){
    // fileContent : {
    //   src : "file source content",
    //   trg : "file target content",
    // }
    //arg.src.fileContent = result.src.fileContent;
    //arg.trg.fileContent = result.trg.fileContent;
    console.log("done !");
    console.log(fileContent);
    // time to show the diff-view !!!
    //
    //initUI(fileContent.src, fileContent.trg);
    showView(VIEW.DIFF);
    var target = document.getElementById("diff-view");
    target.innerHTML = "";

    dv = CodeMirror.MergeView(target, {
      value: fileContent.trg, // target
      orig: null,
      origLeft: fileContent.src,  // source
      lineNumbers: true,
      mode: "text/html",
      highlightDifferences: true,
      connect: null,
      collapseIdentical: false
    });
  });

  ipcRenderer.send("getRemoteFilePair.start",arg);


  ipcRenderer.send('diffView.start');

});
