"use strict";

const ipcRenderer = require('electron').ipcRenderer;

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
var createRowHTML = function(rootPath, cmpItem) {
  var rowClass = "";
  if(cmpItem.existInTarget === false) {
    rowClass = "state-cmp-missing-trg";
  } else if(cmpItem.md5Match === true) {
    rowClass = "state-cmp-ok";
  } else {

    // NOTE : the data-filepath attribute is used by the diff to get the path of the file
    // to display diff view.
    rowClass = "state-cmp-diff";
  }
  // debug
  var absolutePath = cmpItem.path.replace('FS','fs1');
  var relativePath = absolutePath.replace(rootPath + '/',"");

  var tmplRowHTML = '<tr class="'+rowClass+'" data-filepath="'+cmpItem.path+'" >'
  +  '<td title="'+absolutePath+'">'+relativePath+'</td>'
  +  '<td>'
  +    '<div class="cmp-ok">ok</div>'
  +    '<div class="cmp-diff">'
  +      '<button class="view-diff" data-filepath="'+cmpItem.path+'" type="button">view  diff</button>'
  +    '</div>'
  +    '<div class="cmp-missing-trg">'
  +      '<button class="copy-to-trg" data-filepath="'+cmpItem.path+'" type="button">copy to target</button>'
  +    '</div>'
  +    '<div class="cmp-missing-src">missing src</div>'
  +  '</td>'
  + '</tr>';

  return tmplRowHTML;
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
    // clear existing compare result
    var tableBody = document.getElementById("result-compare");
    while(tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    // create HTML
    var resultRowsHTML = data.map(function(item){
      return createRowHTML(app.ctx.src.folderPath, item);
    }).join('\n');

    var panelResultHTML  = '<div class="panel panel-default">'
    + '    <div class="panel-heading">'
    + '     <h3 class="panel-title">'+app.ctx.src.folderPath+'</h3>'
    + '    </div>'
    + '    <div class="panel-body">'
    + '      <table class="table table-hover table-condensed">'
    + '         <tbody>'
    +               resultRowsHTML
    + '         </tbody>'
    + '      </table>'
    + '    </div>'
    + '  </div>';

    // insert HTML
    tableBody.insertAdjacentHTML('beforeend',panelResultHTML);

    // show the compare result table
    app.showView(app.VIEW.RESULT);
};

ipcRenderer.on('remoteCompare.done',function(event,data){
  app.ctx.compareResult = data;
  renderCompareReport(data);
});

/**
 * Handle click on the "restart" button.
 */
const btn_restart = document.getElementById('btn-restart')
.addEventListener('click',function(){
  app.showView(app.VIEW.FORM);
});

document.getElementById('btn-show-only-diff').addEventListener('click',function(){
  $('#result-container').toggleClass('show-only-diff');
});

document.getElementById('btn-refresh-compare').addEventListener('click',function(){
  app.progress.start();
  ipcRenderer.send('remoteCompare.start',app.ctx);
});
