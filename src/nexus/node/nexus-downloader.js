"use strict";

var request = require('request');
var progress = require('request-progress');
var fs = require('fs');
var Q = require('q');

exports.download = function(url, filepath, canContinue) {
  console.log("downloading url : ",url);
  
  var deferred = Q.defer();
  // The options argument is optional so you can omit it
  let req = request(url,{timeout: 10000}); // assign to be able to abort request on user demand

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
      console.log('progress', state);
      if(canContinue && canContinue() === false) {
        req.abort();
        deferred.resolve(true);
      } else {
        deferred.notify(state);
      }
    })
    .on('error', function(err) {
      // Do something with err
      console.log("## ERROR ##");
      console.log(err);
      deferred.reject(err);
    })
    .on('end', function() {
      // Do something after request finishes
      deferred.resolve(true);
    })
    .pipe(fs.createWriteStream(filepath));

    return deferred.promise;
};
