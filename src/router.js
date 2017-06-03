"use strict";

const ipcRenderer = require('electron').ipcRenderer;

$('.mtb-link[data-view]').on('click',function(){
  //console.log(this);
  let $el = $(this);
  let view = $el.data('view');
  // update menu bar
  $('ul.nav li').removeClass('active');
  if( view !== '') {
    $('ul.nav a.mtb-link[data-view="'+view+'"]').parent().addClass('active');
    $('.mtb-view').hide();
    $('#'+view).show();
  }
});
