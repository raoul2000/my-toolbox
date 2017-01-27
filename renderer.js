"use strict";
const ipcRenderer = require('electron').ipcRenderer;

const compareCtx = {};


const result_compare = document.getElementById('result-compare');
result_compare.addEventListener('click',function(event){
  console.log(event.srcElement.textContent);
// TODO : WIP
  var localSrcFilepath = "c:/tmp/srcf1.txt";
  var localTrgFilepath = "c:/tmp/trgf1.txt";
  ipcRenderer.on('getRemoteFileSrc.end', function(event, result) {

    ipcRenderer.send('getRemoteFileTrg.start',{
      "connection" : compareCtx.arg.trg.connection,
      "remoteFilepath" : event.srcElement.textContent,
      "localFilepath" : localTrgFilepath
    });

  });
  ipcRenderer.send('getRemoteFileSrc.start',{
    "connection" : compareCtx.arg.src.connection,
    "remoteFilepath" : event.srcElement.textContent,
    "localFilepath" : localSrcFilepath
  });



});
const btn_restart = document.getElementById('btn-restart')
.addEventListener('click',function(){
  document.getElementById('result-container').classList.add('hidden');
  document.getElementById('form-container').classList.remove('hidden');
});

const btn_start = document.getElementById('btn-start');

/**
 * [srcHost description]
 * @type {[type]}
 */
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

  document.getElementById('form-container').classList.add('hidden');
  const arg = {
    "src" : {
      "connection" : {
        "host" : srcHost,
        "username" : srcUsername,
        "password" : srcPassword
      },
      "folderPath" : folderPath
    },
    "trg" : {
      "connection" :  {
        "host" : trgHost,
        "username" : trgUsername,
        "password" : trgPassword
      },
      "folderPath" : folderPath
    }
  };
  compareCtx.arg = arg;
  ipcRenderer.on('remoteCompare.done',function(event,data){
    // clear existing progress messages
    var tableBody = document.getElementById("result-compare");
    while(tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }

    // hide/show containers
    document
      .getElementById("progress-container")
      .classList
      .add('hidden');

    document
      .getElementById("result-container")
      .classList
      .remove('hidden');

    // add progress messages
    data.forEach(function(item){
      var compareStatus = "";
      if(item.existInTarget === false) {
        compareStatus = '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>';
      } else if(item.md5Match === true) {
        compareStatus = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
      } else {
        compareStatus = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
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
  document.getElementById('progress-container').classList.remove('hidden');
  console.log('sending ...');
  console.log(arg);
  ipcRenderer.send('remoteCompare.start',arg);
});
