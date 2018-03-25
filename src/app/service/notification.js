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
/**
 * notify.error("error message") : text ="error message", title = "Error"
 * notify.error("error message", "my Title") : text ="error message", title = "My Title"
 * notify.error("error message", options) : text ="error message", title = "Error" + options
 * notify.error("error message", "my Title", options) : text ="error message", title = "My Title" + options
 * notify.error(exception) : text ="dynamic", title = "Error"
 * notify.error(exception, "my title") : text ="dynamic", title = "my title"
 * notify.error(exception, "my title", options) : text ="dynamic", title = "my title" + options
 *
 * @type {Object}
 */

function createNotificationType(type) {
  const supportedNotificationType = [ 'success', 'error', 'warning'];

  if( ! type ) {
    throw new Error("mising notification type.");
  }

  let notificationType = supportedNotificationType.find( supportedType => supportedType === type.toLowerCase());
  if( ! notificationType ) {
    throw new Error("unsupported notification type : "+ type + " Choose on of "
      +supportedNotificationType.join(' '));
  }
  return notificationType;
}

function createMessageFromObject(obj) {
  return obj.message;
}

function createNotificationMessage(msg) {
  if( typeof msg === "string") {
    return msg;
  } else if( typeof msg === "object") {
    return createMessageFromObject(msg);
  } else {
    throw new Error('failed to create notification message from '+msg);
  }
}

function createNotificationTitle(type, title) {
  if( typeof title === 'string') {
    return title;
  } else {
    return type;
  }
}

function createNotificationOptions(type, title, message, options) {
  let defaultNotificationOptions = {
    "title" : title,
    "text": message,
    "type": type ,
    "animate_speed": "fast",
    "animate": "slide",
    "delay": 3000,
    "buttons": {
      "closer": true
    }
  };
  if( typeof options === "object") {
    return Object.assign(defaultNotificationOptions, options);
  } else {
    return defaultNotificationOptions;
  }
}
function createNotification(type) {
  return function( message, title, options) {
    let _type    = createNotificationType(type);
    let _message = createNotificationMessage(message);
    let _title   = createNotificationTitle(_type, title);
    let _options = {};
    if( typeof title === "object") {
      _options = createNotificationOptions(_type, _title, _message, title);
    } else {
      _options = createNotificationOptions(_type, _title, _message, options);
    }
    let notif = new PNotify(_options);
  };
}


module.exports = {
  "notification" : notification,
  "success"      : createNotification("success"),
  "error"        : createNotification("error"),
  "warning"      : createNotification("warning"),
  "confirm"      : confirm
};
