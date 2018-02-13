"use strict";

const DOMParser  = require('xmldom').DOMParser;
/**
 * Extract version umber from XML document.
 * Returns the text value of the first 'version' element
 * @param  {string} data XML string
 * @return {string}      the extracted version number
 */
exports.extract = function(data) {
  
  var parseErrors = {
    "warning" : [],
    "error"   : [],
    "fatal"   : []
  };

  var dom = new DOMParser({
    errorHandler:{
      warning   : parseErrors.warning.push,
      error     : parseErrors.error.push,
      fatalError: parseErrors.fatal.push
    }
  }).parseFromString(data,'text/xml');
  return dom.getElementsByTagName("version").item(0).firstChild.nodeValue;
};
