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
    "tcid-list"   : require('./tcid-list/main'),
    "scan-webapp" : require('./scan-webapp/main')
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
        let modeDev = false;
        let scanResultPromise = null;
        if( modeDev === true) {
          // in dev mode, do not perform actual scan but load a previously saved JSON file
          // and use its content as scan result
          var obj = JSON.parse(fs.readFileSync(__dirname + '/result.json', 'utf8'));
          scanResultPromise = Promise.resolve(obj.results);
        } else {
          // in prod mode, perform actual scan
          scanResultPromise = tomcatScanner.run({
            ssh : this.item.data.ssh,
            tomcats : [  { id : "CORE"}, { id : "INOUT"}]
          });
        }

        scanResultPromise
        .then( results => {
          if( modeDev === true) {
            fs.writeFile(__dirname + '/result.json', JSON.stringify({ "results" : results}, null, 2) , 'utf-8', (err) => {
              if(err) {
                console.error(err);
              }
            });
          }

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
                  "refId"              : null,
                  "name"               : "NO NAME",
                  "servlets"           : webapp.servlets
                };

                webapp.servlets.find(servlet => {
                  return self.$store.state.webappDefinition.find(webappDef => {
                    let reference =  webappDef.class.find( aClass => aClass === servlet.class);
                    if( reference ) {
                      newWebapp.refId = webappDef.id;
                      newWebapp.name = webappDef.name;
                      return true;
                    } else {
                      return false;
                    }
                  });
                });
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
  }
});
