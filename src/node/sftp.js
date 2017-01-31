"use strict";
var Q = require('q');
var fs = require('fs');

const SFTPClient = require('ssh2-sftp-client');

/**
 * list remote folder
 * cnx  = {
   host: '127.0.0.1',
   port: '8080',
   username: 'username',
   password: '******'
 }
 * @param  {[type]} cnx  [description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function list(cnx,path) {
  // we use Q as Promisse library
  return Q.Promise(function(resolve, reject, notify){

    let sftp = new SFTPClient();
    sftp.connect(cnx)
    .then(() => {
      return sftp.list(path);
    }).then((data) => {
      console.log(data, 'the data info');
      sftp.end();
      resolve(data);
    }).catch((err) => {
      console.log(err, 'catch error');
      reject(err);
    });
  });
}
exports.list = list;

function get(cnx,remoteFilepath, localFilepath, useCompression) {
  return Q.Promise(function(resolve,reject,notify){

    let writable =  null;
    try {
      writable =  fs.createWriteStream(localFilepath);
    } catch (err) {
      reject(err);
    }

    let sftp = new SFTPClient();
    sftp.connect(cnx)
    .then(() => {
      return sftp.get(remoteFilepath, useCompression);
    }).then((stream) => {
      stream.pipe(writable);
      stream.on('end', function(){
        console.log("END");
        sftp.end();
        resolve(true);
      });
      stream.on('error',function(err){
        console.error(err);
        reject(err);
      });
    }).catch((err) => {
      console.log(err, 'catch error');
      reject(err);
    });

  });
}
exports.get = get;
