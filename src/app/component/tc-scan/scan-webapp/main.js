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
      console.log('computed task');
      return  this.$store.getters['tcScan/taskById'](this.taskId);
    }
  },
  methods : {
    /**
     * User selects a tomcat id for to be scanned
     * @param  {string} tcid the tomcat id value
     */
    toggleTomcatSelection : function(tcid) {
      this.$store.commit('tcScan/toggleTomcatSelection', {
        "id"     : tcid,
        "taskId" : this.taskId
      });
    }
  }


};
