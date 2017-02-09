"use strict";

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('remoteCompare.error', function(event, err){
  console.log(event);
  console.error("ERROR !!! ");
  console.error(err);
});


var renderProgress = function(progress) {
  var msg = "";
  switch(progress.task) {
    case "read-source-start": msg = "reading source file";
    break;
    case "read-source-end": msg = "source file found : "+progress.count;
    break;
    case "read-target-start": msg = "Reading Target file ";
    break;
    case "read-target-end": msg = "Target file found : "+progress.count;
    break;
  }
  app.progress.message(msg);
}

ipcRenderer.on('remoteCompare.progress',function(event,progress){
  renderProgress(progress);
});

/**
 * Render  the comparaison table
 *
 * @param  {object} data the comparaison data
 */
var renderCompareReport = function(data) {

    // clear existing compare result
    var tableBody = document.getElementById("result-compare");
    while(tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }

    // render compare results
    data.forEach(function(item){
      var compareStatus = "";
      if(item.existInTarget === false) {
        compareStatus = 'not in target';
      } else if(item.md5Match === true) {
        compareStatus = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
      } else {
        // NOTE : the data-filepath attribute is used by the diff to get the path of the file
        // to display diff view.
        compareStatus = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
        "<button  type=\"button\" class\"view-diff\" data-filepath=\""+item.path+"\">diff</button>";
      }
      var html = "<tr>"
        + "<td>" + item.path + "</td>"
        + "<td>" + compareStatus + "</td>"
      +  "</tr>";
      tableBody.insertAdjacentHTML('beforeend',html);
    });
    app.showView(app.VIEW.RESULT);
    console.log(data);
};


ipcRenderer.on('remoteCompare.done',function(event,data){
  renderCompareReport(data);
});

/**
 * Handle click on the "restart" button.
 */
const btn_restart = document.getElementById('btn-restart')
.addEventListener('click',function(){
  app.showView(app.VIEW.FORM);
});
