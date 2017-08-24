"use strict";

var data = {
  name: 'My Tree',
  children: [
    { name: 'hello' },
    { name: 'wat' },
    {
      name: 'child folder',
      children: [
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        },
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        }
      ]
    }
  ]
};

module.exports = Vue.component('db-explorer', {
  template: require('./main.html'),
  data: function ( ){
    return {
      treeData: data
    };
  }
});

Vue.component('item', {
  template: require('./item.html'),
  props: {
    model: Object
  },
  data: function () {
     return {
       open: false
     };
   },
   computed: {
     isFolder: function () {
       return this.model.children &&
         this.model.children.length;
     }
   },
   methods: {
     toggle: function () {
       if (this.isFolder) {
         this.open = !this.open;
       }
     },
     changeType: function () {
       if (!this.isFolder) {
         Vue.set(this.model, 'children', []);
         this.addChild();
         this.open = true;
       }
     },
     addChild: function () {
       this.model.children.push({
         name: 'new stuff'
       });
     }
   }
 });
