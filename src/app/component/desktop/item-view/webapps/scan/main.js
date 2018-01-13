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
    },
    /*
    tomcatSelectedCount : function() {
      return this.task.tomcats
      .filter( tomcat => tomcat.selected)
      .length;
    }*/
  },
  methods : {
    /**
     * User starts scan for the selected tomcats
     */
    scanSelectedTomcats : function() {
      let tomcatIdsToScan = this.task.tomcats
      .filter( tomcat => tomcat.selected);

      if( tomcatIdsToScan.length === 0) {
        notify('Please select one or more Tomcat to scan','warning','No selection');
      } else {
        console.log('start scan',tomcatIdsToScan);
        this.$store.commit('tcScan/updateTask', {
          "id" : this.taskId,
          "updateWith" : {
            "step"   : "SCAN_WEBAPP",
            "status" : "BUSY"
          }
        });
      }

    },
    /**
     * User selects a tomcat id for to be scanned
     * @param  {string} tcid the tomcat id value
     */
    toggleTomcatSelection : function(tcid) {
      this.$store.commit('tcScan/toggleTomcatSelection', {
        "id"     : tcid,
        "taskId" : this.taskId
      });
    },
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
      //ssh.connect(this.item.data.ssh)
      Promise.resolve(true)
      .then( () => {
        return {
          value : ["A", "B", "C"]
        };
        /*
        return smartCommand.run(ssh,{
          "command"    : `. .bash_profile; set -o pipefail; cat $HOME/cfg/eomvar.dtd | grep TOMCAT_ | cut -d ' ' -f 2 | cut -d '_' -f 2 | sort > $TMPDIR/$$.tmp && uniq $TMPDIR/$$.tmp && rm $TMPDIR/$$.tmp`,
          "resultType" : "list"
        });*/
      })
      .then( result => {
        self.$store.commit('tcScan/updateTask', {
          "id" : self.taskId,
          "updateWith" : {
            "status" : "SUCCESS",
            "result" : result,
            "tomcats": result.value.map( id => {
              return {
                "id"       : id,
                "selected" : false
              };
            })
          }
        });
        console.log('result',result);
        ssh.dispose();
      })
      .catch(err => {
        self.$store.commit('tcScan/updateTask', {
          "id" :self.taskId,
          "updateWith" : {
            "status"       : "ERROR",
            "errorMessage" : err.message,
            "error"        : err
          }
        });
        ssh.dispose();
      });
    }
  },
  // life cycle hook
  mounted : function(){
    this.taskId = this.getTaskId();
    if( ! this.task ) { // this.task : computed property
      this.$store.commit('tcScan/addTask',{
        "id"     : this.taskId,
        "step"   : "INIT",
        "status" : "IDLE",
        "result" : null,
        "tomcats": [],
        "errorMessage" : ""
      });
    }
  }
});
