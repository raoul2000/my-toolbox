"use strict";
const EventEmitter = require('events');

class NotificationEventEmitter extends EventEmitter {}

// initialize PNotify theme and settings
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.width = "450px";

/**
 * Display a notification
 * @param  {string} text  text displayed in the notification
 * @param  {type} type  notification  type "success", "warning",  "error"
 * @param  {string} title notification title
 */
function notification(text, type, title) {
  let notif = new PNotify({
    title : title || "",
    text: text,
    type: type || "success",
    animate_speed: "fast",
    animate: "slide",
    delay: 3000,
    buttons: {
      "closer": true
    }
  });
}

function notifySuccess(title, text) {
  notification(text, 'success', title);
}
function notifyError(title, text) {
  notification(text,  'error', title);
}
function notifyWarning(title, text) {
  notification(text, 'warning', title);
}

function confirm (title,text) {
  let  event = new NotificationEventEmitter();

  (new PNotify({
      "title" : title,
      "text"  : text,
      "icon"  : 'glyphicon glyphicon-question-sign',
      hide    : false,
      confirm : { confirm: true   },
      buttons : {  closer: false, sticker: false },
      history : { history: false},
      stack   : {"dir1": "down", "dir2": "left", "modal": true, "overlay_close": true}
  }))
  .get()
  .on('pnotify.confirm', () => { event.emit('confirm')} )
  .on('pnotify.cancel',  () => { event.emit('cancel')} );
  return event;
}

module.exports = {
  "notification" : notification,
  "success"      : notifySuccess,
  "error"        : notifyError,
  "warning"      : notifyWarning,
  "confirm"      : confirm
};
