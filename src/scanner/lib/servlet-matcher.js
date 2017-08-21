"use strict";

function findByClassname(servlet, ref) {
  return Object.keys(ref).find( k => ref[k].class.indexOf(servlet.classname) !== -1 );
}


function identifyServlets( tcScan, ref) {
  tcScan.tomcat.forEach(tc => {
    tc.conf.contextList.forEach(ctxList => {
      ctxList.context.forEach( ctx => {
        ctx.servlet.forEach(servlet => {
          var servletKey = findByClassname(servlet.class, ref);
          if(servletKey) {
            console.log('found ref item : ', servletKey);
          } else {
            console.log('NOT found ref item : ');
          }
          servlet.ref = ref[servletKey];
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
