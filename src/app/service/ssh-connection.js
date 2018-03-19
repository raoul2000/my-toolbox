'use strict';


exports.resolveHost = function(itemData) {
  //item.
};

exports.getInfo = function(itemData) {
  if( ! itemData) {
    throw new Error('missing argument : itemData');
  }
  //debugger;
  //$('#generic-modal-body').html('<b>boo</b>');
  //document.getElementById('generic-modal-body').innerHtml = '<b>foo</b>';
  $('#generic-modal').modal("show").one('hidden.bs.modal', function (e) {
    console.log(e);
  });
/*
  if( ! itemData.ssh.host ) {
    console.log('foo');
  }
  return {
    'host' : exports.resolveHost(itemData)
  };*/
};
