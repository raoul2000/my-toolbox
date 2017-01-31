"use strict";
const ipcRenderer = require('electron').ipcRenderer;

const VIEW = {
  NONE : "",
  FORM : "form",
  PROGRESS : "progress",
  RESULT : "result",
  DIFF : "diff"
};

function showView(viewName){
  document.getElementById('main-container').dataset.view = viewName;
}

const compareCtx = {};

// TEST ONLY
//
document.getElementById('btn-test-winnmerge').addEventListener('click',function(event){
  ipcRenderer.send('compareExternal.start');
});

const result_compare = document.getElementById('result-compare');

result_compare.addEventListener('click_DISABLED',function(event){
  console.log(event.srcElement.textContent);
// TODO : WIP
  var localSrcFilepath = "c:/tmp/srcf1.txt";
  var localTrgFilepath = "c:/tmp/trgf1.txt";

  ipcRenderer.on('getRemoteFileSrc.end', function(event, source) {

    ipcRenderer.send('getRemoteFileTrg.start',{
      "connection" : compareCtx.arg.trg.connection,
      "remoteFilepath" : event.srcElement.textContent,
      "localFilepath" : localTrgFilepath
    });

  });

  ipcRenderer.on('getRemoteFileTrg.end', function(event, target) {
    console.log("done !");
  });

  ipcRenderer.send('getRemoteFileSrc.start',{
    "connection"     : compareCtx.arg.src.connection,
    "remoteFilepath" : event.srcElement.textContent,
    "localFilepath"  : localSrcFilepath
  });
});

/**
 * Handle click on the "restart" button.
 */
const btn_restart = document.getElementById('btn-restart')
.addEventListener('click',function(){
  showView(VIEW.FORM);
});

/**
 * Start the comparaison
 */
const btn_start = document.getElementById('btn-start');

btn_start.addEventListener('click',function(event){

  console.log("btn_start click");
  // get form values
  // clear existing progress messages
  const srcHost     = document.getElementById('src-host').value;
  const srcUsername = document.getElementById('src-username').value;
  const srcPassword = document.getElementById('src-password').value;

  const trgHost     = document.getElementById('trg-host').value;
  const trgUsername = document.getElementById('trg-username').value;
  const trgPassword = document.getElementById('trg-password').value;

  const folderPath = document.getElementById('folder-path').value;

  showView(VIEW.NONE);
  const arg = {
    "src" : {
      "connection" : {
        "host" : srcHost,
        "username" : srcUsername,
        "password" : srcPassword
      },
      "folderPath" : "/mnt/c/dev/ws/lab/my-toolbox/test/data/fs1" // folderPath // source folder to compare
    },
    "trg" : {
      "connection" :  {
        "host" : trgHost,
        "username" : trgUsername,
        "password" : trgPassword
      },
      "folderPath" : "/mnt/c/dev/ws/lab/my-toolbox/test/data/fs2" // folderPath // target folder to compare
    }
  };
  compareCtx.arg = arg;
  ipcRenderer.on('remoteCompare.done',function(event,data){
    // clear existing progress messages
    var tableBody = document.getElementById("result-compare");
    while(tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }

    showView(VIEW.RESULT);
    // add progress messages
    data.forEach(function(item){
      var compareStatus = "";
      if(item.existInTarget === false) {
        compareStatus = 'not in target';
      } else if(item.md5Match === true) {
        compareStatus = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
      } else {
        compareStatus = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
        "<button  type=\"button\" class\"view-diff\" data-filepath=\""+item.path+"\">diff</button>";
      }
      var html = "<tr>"
        + "<td>" + item.path + "</td>"
        + "<td>" + compareStatus + "</td>"
      +  "</tr>";
      tableBody.insertAdjacentHTML('beforeend',html);
    });

    console.log(event);
    console.log(data);
  });

  ipcRenderer.on('remoteCompare.progress',function(event,data){
    var msg = "";
    switch(data.task) {
      case "read-source-start": msg = "reading source file";
      break;
      case "read-source-end": msg = "source file found : "+data.count;
      break;
      case "read-target-start": msg = "Reading Target file ";
      break;
      case "read-target-end": msg = "Target file found : "+data.count;
      break;
    }

    document
      .getElementById("progress-message")
      .insertAdjacentHTML('beforeend','<p>'+msg+'</p>');
  });

  ipcRenderer.on('remoteCompare.error', function(event, err){
    console.log(event);
    console.error("ERROR !!! ");
    console.error(err);
  });
  showView(VIEW.PROGRESS);
  console.log('sending ...');
  console.log(arg);

  ipcRenderer.send('remoteCompare.start',arg);
});

document.getElementById('btn-show-result').addEventListener('click',function(event){
  showView(VIEW.RESULT);
});
/**
 * Display the diff view
 */
document.getElementById('result-container').addEventListener('click',function(event){
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

    var  dv = CodeMirror.MergeView(target, {
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
