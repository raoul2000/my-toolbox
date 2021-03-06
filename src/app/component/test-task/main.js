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
      if( this.items.length === 0 ) {
        return;
      }

      this.items.forEach( item => {
        DummyTaskService.submitTask({
          "id"    : `dummy-${item.id}`,
          "type"  : "dummy",
          "input" : item
        })
        .promise.then(result => {
          this.$store.commit('dummyItem/updateItem',{
            "id" : item.id,
            "updateWith" : {
              "result" : result
            }
          });
        })
        .catch(error => {
          console.error(error);
        });
      });
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
