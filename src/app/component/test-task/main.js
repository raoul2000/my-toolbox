"use strict";
const store            = require('../../service/store/store');
const DummyTaskService = require('../../service/dummy-task');

module.exports = {
  store,
  components: {
    "task-item"  : require('./task-item/main'),
    "dummy-item" : require('./dummy-item/main')
  },

  data: function() {
    return {
      values : {
        "field1" : "value1",
        "field2" : "value2"
      }
    };
  },
  template: require('./main.html'),
  computed : {
    "tasks" : function() {
      //return  this.$store.state.tmptask.tasks;
      let tasks =  this.$store.getters['tmptask/tasksByType']("dummy-task");
      return tasks;
    },
    "items" : function() {
      //return  this.$store.state.tmptask.tasks;
      //store.state.task.someProp
      return  this.$store.state.dummyItem.items;
    }
  },
  methods: {
    processAllItems : function() {
      /*
      if( this.items.length === 0 ) {
        return;
      }

      let taskInfo = DummyTaskService.submitTask(
        this.items.map( item => ({
          "type"  : "dummy-task",
          "input" : item
        }))
      );

      this.taskId = taskInfo.id;
      this.taskInfo = taskInfo;
      this.taskInfo.promise.then(result => {
        console.log("result = ",result);
      })
      .catch(error => {
        console.error(error);
      });
   }
*/
    },
    createItems : function(){
      for (var i = 0; i < 4; i++) {
        this.$store.commit('dummyItem/addItem',{
          "id" : i,
          "name" : `bob (${i})`,
          "age" : 40+i,
          "result" : ""
        });
      }
    },
    startLongTasks : function() {
      console.log('starting lon tasks ...');
      let taskIds = DummyTaskService.submitManyTasks("dummy-task");
      console.log("taskIds = ",taskIds);
    }
  }
};
