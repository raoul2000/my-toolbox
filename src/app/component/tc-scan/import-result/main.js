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
    /**
     * The current task related to this component through the taskId property
     * passed by parent component.
     */
    task : function() {
      return  this.$store.getters['tcScan/taskById'](this.taskId);
    }
  },
  methods : {
    /**
     * Add a tomcat to the store.
     * If the tomcat identified by its id already exists in the store, it is first deleted
     * and then inserted.
     * @param  {object} tomcat the tomcat object to add to the store
     */
    addTomcat : function(tomcat) {
      //debugger;
      let existingTomcat = this.item.data.tomcats.find(currentTomcat => currentTomcat.id.toUpperCase() === tomcat.id.toUpperCase());
      if ( existingTomcat ) {
        console.log("delete tomcat id : "+tomcat.id);
        this.$store.commit('deleteTomcat', {
          "item"   : this.item,
          "tomcat" : existingTomcat
        });
      }
      console.log("adding tomcat id : "+tomcat.id);
      this.$store.commit('addTomcat', {
        "item" : this.item,
        "tomcat" : tomcat
      });
    },
    /**
     * Process all results of the current task.
     * Each result represents a tomcat object that is added to the store.
     */
    importResult : function() {
      this.task.result.tomcats.forEach( this.addTomcat );
      persistence.saveDesktopItemToFile(this.item);
      this.$router.go(-1);
    }
  }
};
