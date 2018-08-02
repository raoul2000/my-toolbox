'use strict';

const service  = require('../../../service/index');
const smartCommand  = require('../../../lib/lib').smartCommand;
const NodeSSH       = require('node-ssh');
const store         = require('../../../service/store/store');

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
    },
    hasValidSSHCredentials : function() {
      let ssh = this.item.data.ssh;
      return ssh.host.length   !== 0 &&
             ssh.host.username !== 0 &&
             ssh.host.password !== 0 &&
             ssh.host.port     !== 0;
    }
  },
  methods : {
    scanTomcatIdsDev : function() {
      return new Promise( (resolve, reject) => {
        setTimeout(function(){
          resolve({
            value : ["A", "B", "C"]
          });
        },2000);
      });
    },
    scanTomcatIds : function(ssh) {
      let cmdByFolderName = `set -o pipefail; ls -d -- tomcat-*/ |  cut -d '-' -f 2 |  cut -d '/' -f 1  | tr '[:lower:]' '[:upper:]'`;
      let cmdByEntityName =  `. .bash_profile; set -o pipefail; cat $HOME/cfg/eomvar.dtd | grep TOMCAT_ | cut -d ' ' -f 2 | cut -d '_' -f 2 | sort > $TMPDIR/$$.tmp && uniq $TMPDIR/$$.tmp && rm $TMPDIR/$$.tmp`;
      return ssh.connect(service.secret.decryptPassword(this.item.data.ssh))
      .then( () => {
        return smartCommand.run(ssh,{
          "command"    : cmdByFolderName,
          "resultType" : "list"
        });
      });
    },
    startSearchTCId : function() {
      this.$store.commit('tcScan/updateTask', {
        "id" : this.task.id,
        "updateWith" : {
          "status" : "BUSY",
          "tomcats" : []
        }
      });
      let self = this;
      let ssh = new NodeSSH();

      //this.scanTomcatIdsDev()
      this.scanTomcatIds(ssh)
      .then( result => {
        self.$store.commit('tcScan/updateTask', {
          "id" : self.task.id,
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
        this.$emit("tcid-list-success");
      })
      .catch(err => {
        self.$store.commit('tcScan/updateTask', {
          "id" :self.task.id,
          "updateWith" : {
            "status"       : "ERROR",
            "errorMessage" : err.message,
            "error"        : err
          }
        });
        ssh.dispose();
      });
    }
  }
};
