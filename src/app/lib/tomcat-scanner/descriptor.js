"use strict";
var xmlParser = require('../xml/parser');
/**
 * Extract context informations from a tomcat web descriptor provided as a DOM.
 *
 * Returns = [
 *  {
 *    "name" : "the servlet Name",
 *    "class" : "servlet.main.class.name",
 *    "urlPatterns" : [
 *      "pattern1", "pattern2", etc...
 *    ]
 *  },
 *  { ... }
 * ]
 *
 * @param  {dom} Document
 * @return {object}      see comments
 */
function extractDescriptorInfo(dom) {

  // because the xpath module was not working correctly, use xmldom
  // to extract required info

  var result = [], servletName = "", servletItem;

  var servletTagList = dom.getElementsByTagName("servlet");
  var servletMappingTagList = dom.getElementsByTagName("servlet-mapping");
  for(var i=0; i<servletTagList.length; i ++) {

    servletName  = servletTagList[i].getElementsByTagName('servlet-name').item(0).firstChild.nodeValue;

    servletItem = {
      "name"        : servletName,
      "urlPatterns"  : [],
      "class"       : null  // not all servlet have a servlet-class
    };
    try {
      servletItem.class = servletTagList[i].getElementsByTagName('servlet-class').item(0).firstChild.nodeValue;
    } catch (e) {
        console.warn("servlet name "+servletName+" has no class value");
        servletItem.class = "";
    }

    try {
      for (var j = 0; j < servletMappingTagList.length; j++) {
        if( servletName === servletMappingTagList[j].getElementsByTagName('servlet-name').item(0).firstChild.nodeValue) {
          var pattern = servletMappingTagList[j].getElementsByTagName('url-pattern').item(0);
          if(pattern.firstChild) {
            servletItem.urlPatterns.push(pattern.firstChild.nodeValue);
          } else {
            servletItem.urlPatterns.push("");
          }
        }
      }
    } catch (e) {
      console.warn("failed to read url-pattern for servlet name = "+servletName);
    }
    result.push(servletItem); // add to servlet list
  }
  return result;
}

/**
 * options = {
 *  "ssh" : Object, // NodeSSH valide and connected
 *  "descriptorPath" : "/path/to/web.xml",
 *  "entities" : object // key/value pair
 *
 * }
 *
 * Result = {
 *  "descriptorPath" : "/path/to/the/web.xml",
 *  "servlets"       : [
 *    {
 *      "class"      : "the.web.app.class",
 *      "name"       : "the web app name",
 *      "urlPatterns" : [
 *        "pattern1", "pattern2", etc...
 *      ]
 *    },
 *    { .... }
 *  ]
 * }
 *
 * [
 * ]
 * @param  {Object} options options
 * @return {Promise}
 */
function getAllServlet(options) {
  let ssh = options.ssh;
  let filePath = options.descriptorPath;
  let entities = options.xmlEntities;

  var cmd = `cat ${filePath}`;
  return ssh.execCommand(cmd, { stream : 'stdout'})
  .then(result => {
    console.log(result);
    return xmlParser.parse(result.stdout, entities);
  })
  .then( dom => {
    console.log(dom);
    return {
      "descriptorPath" : options.descriptorPath,
      "servlets"       : extractDescriptorInfo(dom)
    };
  });
}

exports.getAllServlet = getAllServlet;
