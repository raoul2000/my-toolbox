"use strict";

const ipcRenderer = require('electron').ipcRenderer;

$('.mtb-link').on('click',function(){
  console.log(this);
  let $el = $(this);
  $('ul.nav li').removeClass('active');
  $el.parent('li').addClass('active');
  let view = $el.data('view');
  if( view !== '') {
    $('.mtb-view').hide();
    $('#'+view).show();
  }
});
