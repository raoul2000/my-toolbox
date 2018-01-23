'use strict';
const smartCommand  = require('../../../../../lib/lib').smartCommand;
const tomcatScanner = require('../../../../../lib/lib').tomcatScanner;
const helper        = require('../../../../../lib/lib').helper;
const persistence   = require('../../../../../lib/lib').persistence;

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
        let self = this;

        this.$store.commit('tcScan/updateTask', {
          "id" : this.taskId,
          "updateWith" : {
            "step"   : "SCAN_WEBAPP",
            "status" : "BUSY"
          }
        });
        tomcatScanner.run({
          ssh : this.item.data.ssh,
          //tomcats : [ { id : "ID1"}, { id : "CORE"}, { id : "ID2"}]
          tomcats : [  { id : "CORE"}, { id : "INOUT"}]
        })
        .then( results => {
          // there is ont result per tomcat
          console.log(results);
          results.filter(result => result.resolved && ! result.error )
          .forEach( result => {
            let tomcatId = result.value.id;
            let tomcatIdx = self.item.data.tomcats.findIndex(tomcat => tomcat.id === result.value.id);
            if( tomcatIdx === -1) {
              // this is a new tomcat instance
              // We must modify the result so it matches with expected object structure
              let newWebapps = result.value.webapps.map( webapp => {
                let webappName = "";
                let newWebapp = {
                  "_id"                : helper.generateUUID(),
                  "contextPath"        : webapp.contextPath,
                  "descriptorFilePath" : webapp.descriptorFilePath,
                  "refid"              : null,
                  "name"               : "NO NAME",
                  "servlets"           : webapp.servlets
                };

                webapp.servlets.find(servlet => {
                  // FIXME : should use a getter function instead of direct access !!
                  return self.$store.getters.webappDefinition.find(webappDef => {
                    let reference =  webappDef.class.find( aClass => aClass === servlet.class);
                    if( reference ) {
                      newWebapp.refid = webappDef.id;
                      newWebapp.name = webappDef.name;
                      return true;
                    } else {
                      return false;
                    }
                  });
                });
                /*
                webapp.servlets.forEach(servlet => {
                  self.$store.getters.webappDefinition.forEach(webappDef => {
                    let reference =  webappDef.class.find( aClass => aClass === servlet.class);
                    newWebapp.refid = webappDef.id;
                    newWebapp.name = webappDef.name;
                  });
                });*/
                return newWebapp;
              });

              this.$store.commit('addTomcat', {
                "item" : self.item,
                "tomcat" : {
                  "_id"     : helper.generateUUID(),
                  "id"      : result.value.id,
                  "port"    : result.value.port,
                  "webapps" : newWebapps
                }
              });
            }
          });
          persistence.saveDesktopnItemToFile(this.item);
        })
        .catch(err => {
          console.log(err);
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
      this.$emit('close');
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
