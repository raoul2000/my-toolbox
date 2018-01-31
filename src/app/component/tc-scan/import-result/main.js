'use strict';

const smartCommand  = require('../../../lib/lib').smartCommand;
const NodeSSH       = require('node-ssh');
const store         = require('../../../service/store/store');

module.exports = {
  store,
  props: ['item', 'taskId'],
  data: function() {
    return {
      validation: {
        "name"        : true,
        "class"       : true,
        "urlPatterns" : true
      }
    };
  },
  template: require('./main.html'),
  computed : {
    task : function() {
      return  this.$store.getters['tcScan/taskById'](this.taskId);
    }
  },
  methods : {
    scanTomcatIdsDev : function() {
      console.log('foo');
    }
  }
};
