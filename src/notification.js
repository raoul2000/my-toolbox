"use strict";

// initialize PNotify theme and settings
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.width = "450px";

/**
 * Display a notification
 * @param  {string} text  text displayed in the notification
 * @param  {type} type  notification  type "success", "warning",  "error"
 * @param  {string} title notification title
 */
function notify(text, type, title) {
  let notif = new PNotify({
    title : title || "",
    text: text,
    type: type || "success",
    animate_speed: "fast",
    animate: "slide",
    delay: 30000,
    buttons: {
      "closer": true
    }
  });
}
