'use strict';
var smartCommand = require('../../../../../lib/lib').smartCommand;
const NodeSSH = require('node-ssh');

module.exports = Vue.component('modal-tc-scan',  {
  props : ['item'],
  data : function(){
    return {
      taskId : null
    };
  },
  template: require('./main.html'),
  computed : {
    task : function() {
      return  this.$store.getters['tcScan/taskById'](this.taskId);
    }
  },
  methods : {
    cancel : function(){
      this.$store.commit('tcScan/deleteTask', this.task);
    },
    getTaskId : function(){
      return `${this.item.data.ssh.username}@${this.item.data.ssh.host}`;
    },
    startSearchTCId : function() {
      this.$store.commit('tcScan/updateTask', {
        "id" : this.taskId,
        "updateWith" : {
          "step"   : "SCAN_TC_ID",
          "status" : "BUSY"
        }
      });
      let self = this;
      let ssh = new NodeSSH();
      ssh.connect(this.item.data.ssh)
      .then( () => {
        return smartCommand.run(ssh,{
          "command"    : `. .bash_profile; set -o pipefail; cat $HOME/cfg/eomvar.dtd | grep TOMCAT_ | cut -d ' ' -f 2 | cut -d '_' -f 2 | sort > $TMPDIR/$$.tmp && uniq $TMPDIR/$$.tmp && rm $TMPDIR/$$.tmp`,
          "resultType" : "list"
        });
      })
      .then( tcIds => {
        self.$store.commit('tcScan/updateTask', {
          "id" :self.taskId,
          "updateWith" : {
            "status" : "SUCCESS",
            "result" : tcIds
          }
        });
        console.log('tcIds',tcIds);
      })
      .catch(err => {
        self.$store.commit('tcScan/updateTask', {
          "id" :self.taskId,
          "updateWith" : {
            "status" : "ERROR",
            "error"  : err.message
          }
        });
      });
    }
  },
  // life cycle hook
  mounted : function(){
    this.taskId = this.getTaskId();
    let theTask = this.$store.getters['tcScan/taskById'](this.taskId);
    if( ! theTask ) {
      this.$store.commit('tcScan/addTask',{
        "id" : this.taskId,
        "step" : "INIT",
        "status" : "IDLE"
      });
    }
  }
});
