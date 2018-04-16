"use strict";

const DummyTaskService = require('../../../service/dummy-task');
const service   = require('../../../service/service').service;
module.exports = {
  props : ['item'],
  data: function() {
    return {
      "taskId"   : null
    };
  },
  template : require('./main.html'),
  computed : {
    taskInProcess : function(){
      return this.taskId !== null;
    },
    task : function() {
      return  this.taskId === null
        ? null
        : this.$store.getters['tmptask/taskById'](this.taskId);
    },
    dummyTask : function() {
      return this.$store.getters['tmptask/taskById'](this.dummyTaskId);
    },
    dummyTaskId : function() {
      return `dummy-${this.item.id}`;
    }
  },
  methods: {
    processItem : function() {
      DummyTaskService.submitTask({
         "id" : this.dummyTaskId,
        "type"  : "dummy",
        "input" : this.item
      })
      .promise.then(result => {
        this.$store.commit('dummyItem/updateItem',{
          "id" : this.item.id,
          "updateWith" : {
            "result" : result
          }
        });
      })
      .catch(error => {
        service.notification.error(
          'failed to start task'
        );
        console.error(error);
      });
    }
  }
};
