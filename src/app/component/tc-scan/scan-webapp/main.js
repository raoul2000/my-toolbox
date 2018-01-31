'use strict';

const smartCommand  = require('../../../lib/lib').smartCommand;
const NodeSSH       = require('node-ssh');
const store         = require('../../../service/store/store');
const tomcatScanner = require('../../../lib/lib').tomcatScanner;
const helper        = require('../../../lib/lib').helper;
const persistence   = require('../../../lib/lib').persistence;
const fs            = require('fs');

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
    task : function() {
      console.log('computed task');
      return  this.$store.getters['tcScan/taskById'](this.taskId);
    }
  },
  methods : {
    /**
     * User check/uncheck a tomcat id to be scanned
     * @param  {string} tcid the tomcat id value
     */
    toggleTomcatSelection : function(tcid) {
      this.$store.commit('tcScan/toggleTomcatSelection', {
        "id"     : tcid,
        "taskId" : this.taskId
      });
    },
    /**
     * User clicks Start : start tomcat scan process on the selected
     * instances
     */
    start : function() {
      let tomcatIdsToScan = this.task.tomcats
        .filter( tomcat => tomcat.selected)
        .map( tomcat => tomcat.id);

      console.log('start scan',tomcatIdsToScan);

      if( tomcatIdsToScan.length === 0) {
        notify('Please select one or more Tomcat to scan','warning','No selection');
      } else {
        this.scanTomcats(tomcatIdsToScan);
      }
    },
    /**
     * Actually perform the tomcat scan operation on the tomcat list
     * passed as argument
     * @param  {[string]} tomcatIds tomcat object list
     */
    scanTomcats : function( tomcatIds) {
      let self = this;
      this.$store.commit('tcScan/updateTask', {
        "id" : this.taskId,
        "updateWith" : {
          "status" : "BUSY"
        }
      });

      let modeDev = true;
      let scanResultPromise = null;
      if( modeDev ) {
        // in dev mode, do not perform actual scan but load a previously saved JSON file
        // and use its content as scan result
        var obj = JSON.parse(fs.readFileSync(__dirname + '/result.json', 'utf8'));
        scanResultPromise = Promise.resolve(obj.results);
      } else {
        // in prod mode, perform actual scan on tomcat ids recevied
        scanResultPromise = tomcatScanner.run({
          ssh     : this.item.data.ssh,
          tomcats : tomcatIds.map(id => ({ "id" : id}))
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
            // TODO : implement task/addTomcat
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
        this.$emit("tc-scan-success");
        //persistence.saveDesktopnItemToFile(this.item);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
};
