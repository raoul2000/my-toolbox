"use strict";
const store            = require('../../service/store/store');
const DummyTaskService = require('../../service/dummy-task');

module.exports = {
  store,
  components: {
    "task-item": require('./task-item/main')
  },

  data: function() {
    return {
      values : {
        "field1" : "value1",
        "field2" : "value2"
      },
      validation: {
        "field1"        : true,
        "field2"        : true
      }
    };
  },
  template: require('./main.html'),
  computed : {
    "tasks" : function() {
      return  this.$store.state.tmptask.tasks;
    }
  },
  methods: {
    startLongTasks : function() {
      console.log('starting lon tasks ...');
      DummyTaskService.submitManyTasks();
    }
  }
};
