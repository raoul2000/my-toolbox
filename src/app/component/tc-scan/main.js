'use strict';


const smartCommand  = require('../../lib/lib').smartCommand;
const tomcatScanner = require('../../lib/lib').tomcatScanner;
const helper        = require('../../lib/lib').helper;
const persistence   = require('../../lib/lib').persistence;
const NodeSSH       = require('node-ssh');
const fs            = require('fs');
const store         = require('../../service/store/store');

module.exports = Vue.component('tc-scan',  {
  store,
  data : function(){
    return {
      taskId : null,
      item   : null
    };
  },
  template: require('./main.html'),
  components: {
    "tcid-list"     : require('./tcid-list/main'),
    "scan-webapp"   : require('./scan-webapp/main'),
    "import-result" : require('./import-result/main')
  },
  computed : {
    task : function() {
      return  this.$store.getters['tcScan/taskById'](this.taskId);
    }
  },
  methods : {
    onTcIdListSuccess : function() {
      console.log('onTcIdListSuccess');
      this.$store.commit('tcScan/updateTask', {
        "id" : this.task.id,
        "updateWith" : {
          "step"   : 'SCAN_WEBAPP',
          "status" : "IDLE"
          }
        }
      );
    },
    onTcScanSuccess : function() {
      this.$store.commit('tcScan/updateTask', {
        "id" : this.task.id,
        "updateWith" : {
          "step"   : 'IMPORT_RESULT',
          "status" : "IDLE"
          }
        }
      );
    },
    cancel : function(){
      this.$store.commit('tcScan/deleteTask', this.task);
      this.$router.go(-1);
    },
    getTaskId : function(){
      return `${this.item.data.ssh.username}@${this.item.data.ssh.host}`;
    }
  },
  // life cycle hook
  beforeMount : function(){
    // get the desktop item index from the route query param
    let itemId = this.$route.params.id;
    // find the desktop item in the store
    this.item = this.$store.getters.desktopItemById(itemId);

    this.taskId = this.getTaskId();
    if( ! this.task ) { // this.task : computed property
      this.$store.commit('tcScan/addTask',{
        "id"           : this.taskId,
        "step"         : "SCAN_TC_ID",
        "status"       : "IDLE",
        "result"       : null,
        "tomcats"      : [],
        "errorMessage" : ""
      });
    }
  },
  mounted : function() {
    Mousetrap.bind('esc', this.cancel, 'keyup');
  }
});
