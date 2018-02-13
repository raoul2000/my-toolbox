"use strict";

/**
 * from https://github.com/sindresorhus/semver-regex
 * @return {[type]} [description]
 */
function semverRegex() {
	return /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/ig;
}

exports.extract = function(data) {
  var semver = semverRegex().exec(data);
  if(semver) {
    return semver[0];
  } else {
    throw new Error('version not found');
  }
};
