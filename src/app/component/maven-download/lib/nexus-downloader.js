"use strict";

var request = require('request');
var progress = require('request-progress');
var fs = require('fs');
var Q = require('q');

/**
 * download to local path
 *
 * options = {
 *  "url" : "http://.....",                       // mandatory : the url to download from
 *  "destinationFilePath" : "/folder/file.txt",   // mandatory : full path to the downloaded file
 *  "requestTimeout" : 5,                         // optional - timeout in seconds
 *  "notifier" : object                           // optional - object EventEmitter to observe download progress
 *  "canContinue" : f() {}                        // optional - function returning a boolean. When False, download is interrupted
  * }
  * 
  * If a 'notifier' is provided, it must implement the EventEmitter interface in order
  * to process progress events fired during the download task.
  *
 * @param  {Object} options [description]
 * @return {[type]}         [description]
 */
exports.download = function(options) {
  console.log('downloader');
  return new Promise( (resolve, reject) => {
    // validate options ////////////////////////////////////////////////////////
    //
    if( ! options.url) {
      reject("missing url");
    }
    if( ! options.destinationFilePath) {
      reject("missing destinationFilePath");
    }

    if( options.requestTimeout && typeof options.requestTimeout !== 'number'){
      reject("invalid type : requestTimeout must be an integer value");
    }

    if( options.canContinue && typeof options.canContinue !== "function") {
      reject('invalid type : canContinue must be a function');
    }

    // TODO : validate options//////////////////////////////////////////////////
    //

    let  timeout = options.requestTimeout || 8; // in seconds

    let _notifyEvent = function(event,data) {
      console.log('event = ',event);
      console.log('data = ',data);

      if( options.notifier ) {
        options.notifier.emit(event,data);
      }
    };

    let req = request(
      options.url,
      {
        timeout: timeout * 1000
      }
    ); // assign to be able to abort request on user demand
    _notifyEvent("connect");
    let endOnUserRequest =  false;
    progress(req , {
        // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
        // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
        // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
      })
      .on('progress', function(state) {
        // The state is an object that looks like this:
        // {
        //     percent: 0.5,               // Overall percent (between 0 to 1)
        //     speed: 554732,              // The download speed in bytes/sec
        //     size: {
        //         total: 90044871,        // The total payload size in bytes
        //         transferred: 27610959   // The transferred payload size in bytes
        //     },
        //     time: {
        //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
        //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
        //     }
        // }
        _notifyEvent("progress", Math.round(state.percent * 100));

        // check is download was not interrupted by request
        if( options.canContinue && options.canContinue() === false) {
          req.abort();
          endOnUserRequest = true;
        }
      })
      .on('error', function(err) {
        _notifyEvent("error",err);
        reject(err);
      })
      .on('end', function() {
        let lastEvent =  endOnUserRequest ? "abort" : "success";
        _notifyEvent(lastEvent);
        resolve(lastEvent);
      })
      .pipe(fs.createWriteStream(options.destinationFilePath));

  }); // end Promise
};
