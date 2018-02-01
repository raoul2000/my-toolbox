'use strict';

const smartCommand  = require('../../../lib/lib').smartCommand;
const NodeSSH       = require('node-ssh');
const store         = require('../../../service/store/store');
var persistence     = require('../../../lib/lib').persistence;

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
    addTomcat : function(tomcat) {
      this.$store.commit('addTomcat', {
        "item" : this.item,
        "tomcat" : tomcat
      });
    },
    importResult : function() {
      this.task.result.tomcats.forEach( this.addTomcat );
      persistence.saveDesktopnItemToFile(this.item);
      this.$router.go(-1);
    }
  }
};
