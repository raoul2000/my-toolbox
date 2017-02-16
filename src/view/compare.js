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
 * create HTML markup for one line for the compare result table
 *
 * cmpitem = {
 *  "md5"  : "erqdfqsd",
 *  "path" : "/folder/file-1.txt",
 *  existInTarget : true,
 *  md5Match : true
 * }
 *
 * @param  {object} cmpItem the compared item to render
 * @return {string}         HTML string
 */
var createRowHTML = function(cmpItem) {
  var compareStatus = "";
  if(cmpItem.existInTarget === false) {
    compareStatus = 'not in target';
  } else if(cmpItem.md5Match === true) {
    compareStatus = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
  } else {
    // NOTE : the data-filepath attribute is used by the diff to get the path of the file
    // to display diff view.
    compareStatus = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
    "<button  type=\"button\" class=\"view-diff\" data-filepath=\""+cmpItem.path+"\">diff</button>";
  }
  var refreshButton = "<button  type=\"button\" class=\"refresh-diff\" data-filepath=\""+cmpItem.path+"\">refresh</button>";

  return "<tr>"
    + "<td>" + cmpItem.path + "</td>"
    + "<td>" + compareStatus + "</td>"
    + "<td>" + refreshButton + "</td>"
  +  "</tr>";

};
/**
 * Render  the comparaison table.
 * The 'data' is the list of files that could be found in the "source" host and were compared
 * to the one found in the "target" host.
 *
 * data : [
 *  { "md5" : "erqdfqsd", "path" : "/folder/file-1.txt", existInTarget : true, md5Match : true},
 *  { "md5" : "223ER",    "path" : "/folder/file-2.txt", existInTarget : true, md5Match : false},
 *  etc ...
 * ]
 *
 * @param  {object} data the comparaison data
 */
var renderCompareReport = function(data) {
    app.ctx.compareResult = data;

    // clear existing compare result
    var tableBody = document.getElementById("result-compare");
    while(tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    // add HTML rows inside the table body
    tableBody.insertAdjacentHTML('beforeend',
      data.map(function(item){
        return createRowHTML(item);
      }).join('\n')
    );

    // show the compare result table
    app.showView(app.VIEW.RESULT);
    console.log(data);
};

ipcRenderer.on('remoteCompare.done',function(event,data){
  renderCompareReport(data);
});

ipcRenderer.on('remoteCompare.error',function(event,data){
  app.error.show('Error','failed to read remote files');
});

/**
 * Handle click on the "restart" button.
 */
const btn_restart = document.getElementById('btn-restart')
.addEventListener('click',function(){
  app.showView(app.VIEW.FORM);
});
