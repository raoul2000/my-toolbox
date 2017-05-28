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

/*
document.getElementsByClassName('app-route').addEventListener('click',function(el){
  console.log(el);
  console.log(this);
});
*/

/*
document.getElementById('load-diff').addEventListener('click',function(){
  console.log('render : load-diff');
  ipcRenderer.send('load-diff');
});

document.getElementById('load-home').addEventListener('click',function(){
  console.log('render : load-home');
  ipcRenderer.send('load-home');
});
*/
