"use strict";

const DummyTaskService = require('../../../service/dummy-task');

module.exports = {
  props : ['item'],
  data: function() {
    return {
      "taskId"   : null,
      "taskInfo" : null
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
    }
  },
  methods: {
    processItem : function() {
       let taskInfo = DummyTaskService.submitTask({
        "type"  : "dummy",
        "input" : this.item
      });
      this.taskId = taskInfo.id;
      this.taskInfo = taskInfo;
      this.taskInfo.promise.then(result => {
        console.log("result = ",result);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }
};
