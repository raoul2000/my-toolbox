"use strict";

// the main APP object
//
const app = {
  config : {
    diffTool : {
      external : true,
      command : {
        program : "c:\\Program Files (x86)\\WinMerge\\WinMergeU.exe",
        arg : [
          "${SOURCE}",
          "${TARGET}"
        ]
      }
    }
  },
  ui : {
    progress_message : document.getElementById("progress-message")
  },
  ctx : {
    "src" : {
      "connection" :  {
        "host"     : null,
        "username" : null,
        "password" : null
      },
      "folderPath" : null
    },
    "trg" : {
      "connection" :  {
        "host"     : null,
        "username" : null,
        "password" : null
      },
      "folderPath" : null
    },
    "compareResult" : null
  },
  VIEW : {
    NONE     : "",
    FORM     : "form",
    PROGRESS : "progress",
    RESULT   : "result",
    ERROR    : "error",
    DIFF     : "diff"
  },
  showView : function (viewName){
    document.getElementById('main-container').dataset.view = viewName;
  },
  alert :  function(msg) {
    alert(msg);
  },
  confirm : function(msg) {
    return app.confirm(msg);
  },
  progress : {
    start : function() {
      const message = app.ui.progress_message;
      while(message.firstChild) {
        message.removeChild(message.firstChild);
      }
      app.showView(app.VIEW.PROGRESS);
      return app.progress;
    },
    message : function(msg) {
      app.ui.progress_message.insertAdjacentHTML('beforeend','<pre>'+msg+'</pre>');
    },
    end :  function() {
      app.showView(app.VIEW.NONE);
      return app.progress;
    }
  },
  error : {
    el : {
      container : document.getElementById('error-modal'),
      title : document.getElementById('error-modal').querySelector('.modal-title'),
      body : document.getElementById('error-modal').querySelector('.modal-body')
    },
    show : function(title, description){
      app.error.el.title.innerHTML = title;
      app.error.el.body.innerHTML = '<p>'+description+"</p>";
      $('#error-modal').modal('show');
    }
  }
};
