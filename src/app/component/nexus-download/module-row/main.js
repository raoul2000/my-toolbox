'use strict';

const service   = require('../../../service/index');

/**
 * The Main vuesjs component
 * @type {Object}
 */
module.exports = {
  template : require('./main.html'),
  props    : ['module'],
  data     : function() {
    return {
      loadVersionInfoTaskId : null
    };
  },
  computed: {
    loadingVersionInfo : function(){
       let task = service.store.getters['tmptask/taskById'](this.loadVersionInfoTaskId);
       return task && task.status === "BUSY";
    }
  },
  watch : {

  },
  methods : {
    loadVersionInfo : function() {
      service.nexus.browse.loadVersionInfo(this.module)
      .then( folderItem => {

      })
      .catch(error => {
        service.notification.error(error,"Failed to reach the Nexus !");
      });
    }
  },
  mounted : function(){
    this.loadVersionInfoTaskId = service.nexus.browse.createTaskId(this.module);
  }
};
