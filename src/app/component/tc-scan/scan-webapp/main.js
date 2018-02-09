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
    /**
     * The current task related to this component through the taskId property
     * passed by parent component.
     */
    task : function() {
      console.log('computed task');
      return  this.$store.getters['tcScan/taskById'](this.taskId);
    },
    selectedCount : function(){
      return this.task.tomcats
        .filter( tomcat => tomcat.selected)
        .reduce( (acc,cur) => acc + 1, 0);
    }
  },
  methods : {
    selectAll : function(select) {
      this.$store.commit('tcScan/changeAllTomcatSelection', {
        "taskId" : this.taskId,
        "select" : select
      });
    },
    /**
     * User check/uncheck a tomcat id to be scanned : update the store
     * @param  {string} tcid the tomcat id value
     */
    toggleTomcatSelection : function(tomcat) {
      if( this.task.status !== 'BUSY') {
        this.$store.commit('tcScan/toggleTomcatSelection', {
          "id"     : tomcat.id,
          "taskId" : this.taskId
        });

      }
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
     * Perform following normalisation :
     * - add technical identifiers (_id) to servlets and webapps
     * - link each webapp with a webapp definition (when possible)
     *
     * @param  {object} tomcatResult one resolved result of tomcat scan
     * @return {object}              normalized tomcat result
     */
    normalizeTomcatResult : function(tomcatResult) {
      let tomcatId  = tomcatResult.id;
      let webappDef = null;
      let completedWebapps = tomcatResult.webapps.map( webapp => {
        webapp.servlets.find(servlet => {
          webappDef = this.$store.getters.findWebappDefinitionByClassname(servlet.class);
          return webappDef ? true : false;
        });
        return Object.assign(webapp, {
          "_id"   : helper.generateUUID(),
          "refId" : ( webappDef ? webappDef.id   : null),
          "name"  : ( webappDef ? webappDef.name : "NO NAME")
        });
      });
      return Object.assign(tomcatResult, {
        "_id"     : helper.generateUUID(),
        "version" : "",
        "webapps" : completedWebapps
      });
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

      let modeDev = false;
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
        if( modeDev === false) {
          fs.writeFile(__dirname + '/result.json', JSON.stringify({ "results" : results}, null, 2) , 'utf-8', (err) => {
            if(err) {
              console.error(err);
            }
          });
        }
        console.log(results);

        let tomcatResults = results
          .filter(  result => result.resolved && ! result.error )
          .map( result => this.normalizeTomcatResult(result.value));

        this.$store.commit('tcScan/updateTask', {
          "id"     : self.taskId,
          "updateWith" : {
            "result" : {
              "tomcats" : tomcatResults
            }
          }
        });

        this.$emit("tc-scan-success");
        //persistence.saveDesktopItemToFile(this.item);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
};
