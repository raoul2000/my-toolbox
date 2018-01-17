"use strict";
var xmlParser = require('../xml/parser');
/**
 * Extract context informations from a tomcat web descriptor provided as a DOM.
 * Returns an object where the key is the servlet name and value are servlet class and url-pattern
 * Example :
 *  {
 *    "servlet name": {
 *      "url-pattern": "/findleaks",
 *      "class": "org.apache.catalina.manager.ManagerServlet"
 *    },
 *    etc.
 *  }
 *
 * @param  {dom} Document
 * @return {object}      hash where the key is the servlet name and value are
 * servlet class and url-pattern
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
      "urlPattern"  : [],
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
            servletItem.urlPattern.push(pattern.firstChild.nodeValue);
          } else {
            servletItem.urlPattern.push("");
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


//function getAllServlet(ssh, filePath, entities) {
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
    return extractDescriptorInfo(dom);
  }  );
}

exports.getAllServlet = getAllServlet;
