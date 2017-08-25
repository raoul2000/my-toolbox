"use strict";

function findByClassname(servlet, webappDefinitions) {

  return webappDefinitions.find( webappDefinition => {
    if( servlet.class && webappDefinition.class) {
      return webappDefinition.class.indexOf(servlet.class) !== -1 ;
    } else {
      return false;
    }
  });
}


function identifyServlets( tcScan, ref) {
  tcScan.tomcat.forEach(tc => {
    tc.conf.contextList.forEach(ctxList => {
      ctxList.context.forEach( ctx => {
        ctx.servlet.forEach(servlet => {
          var refItem = findByClassname(servlet, ref);
          if(refItem) {
            console.log('found ref item : ', refItem);
            servlet.rid = refItem.id;
          } else {
            console.log('NOT found ref item : ');
            servlet.rid = null;
          }

        });
      });
    });
  });
}
exports.identifyServlets = identifyServlets;


function createServletIndex(tc, ref) {
  var result = [];
  tc.conf.contextList.forEach(ctxList => {
    ctxList.context.forEach( ctx => {
      ctx.servlet.forEach(servlet => {
        var servletKey = findByClassname(servlet, ref);
        if(servletKey) {
          console.log('found ref item : ', servletKey);
          result.push(ref[servletKey]) ;
        } else {
          console.log('NOT found ref item : ');
        }
      });
    });
  });
  return result;
}

function createIndex(tcScan, ref) {
  return tcScan.tomcat.map(tc => {
    return {
      "id" : tc.id,
      "prop" : tc.prop,
      "servlet" : createServletIndex(tc, ref)
    };
  });
}
exports.createIndex = createIndex;
