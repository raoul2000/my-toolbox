"use strict";


module.exports = {
  props : ['task'],
  data: function() {
    return {
    };
  },
  template: require('./main.html'),
  methods: {
    startLongTasks : function() {
      console.log('starting lon tasks ...');
    }
  }
};
