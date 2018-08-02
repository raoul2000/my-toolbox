"use strict";

const httpRequest = require('./http-request');
const promiseUtil = require('../promise-utils');

function addTrailingSlashToURL(url) {
  return url.endsWith('/')
    ? url
    : url.concat('/');
}

function http_service_ui_info(options) {
  let url = addTrailingSlashToURL(options.url);
  let serviceUrl = `${url}service/ui/info`;
  return httpRequest.getVersion({
    "url" : serviceUrl,
    "versionExtractor" : require('./extractor/service-ui-info')
  });
}

function parse_html_page(options) {
  return httpRequest.getVersion({
    "url" : options.url,
    "versionExtractor" : require('./extractor/regex')
  });
}

/**
 * Extract webapp version.
 * options = {
 *  "url" : "http://hostname:port/path", // mandatory
 * }
 * @param  {object} options see comment
 * @return {Promise}         [description]
 */
exports.getVersion = function(options) {
  if( ! options.url ) {
    return Promise.reject("property url is mandatory");
  }

  let extractionStrategies = [
    http_service_ui_info,
    parse_html_page
  ];

  return promiseUtil.serial(extractionStrategies, function(strategy) {
    return strategy(options);
  });
};
