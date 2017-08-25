var electron = require('electron');
var path = require('path');
var remote = require('electron').remote;
const store    = require('../../service/store/store');

Vue.component('url-list', require('./list/main'));

module.exports = {
  props: ['message'],
  data : function(){
    return {
      disableAction : false,
      actionCompletedCount : 0,
      desktopItemIndex : null,
      action : null,
      summary : [],
      filename : null,
      HTMLHeader : '',
      scan : {
        ssh : {
          host         : '',
          port         : 22,
          username     : '',
          password     : '',
          readyTimeout : 5000
        },
        "name"   : '',
        "entity" : [],
        "tomcat" : []
      }
    };
  },
  template: require('./main.html'),
  methods : {
    pingAllURL : function() {
      this.disableAction = true;
      this.action = "ping-all";
    },
    versionAllURL : function() {
      this.disableAction = true;
      this.action = "version-all";
    },
    actionCompleted : function(result) {
      console.log("actionCompleted : ",result);
      this.action = null;
      this.disableAction = false;
      if( result.action !== this.action) {
        console.error("inconsistent action ACK received : current action is = "+this.action);
      }
    },
    openTomcatManager  : function(tomcat) {
      var managerURL =  `http://${this.scan.ssh.host}:${tomcat.port}/manager/html`;
      console.info("opening Tomcat Manager : "+managerURL);
      electron.shell.openItem(managerURL);
    },
    /**
     * Create the HTML header out of the desktop item relative file path.
     */
    buildHTMLHeader: function () {
      var HTMLResult = '';
      if(  this.filename) {
        var tokens = this.filename.split(path.sep).filter( i => i.length !== 0);
        console.log("tokens", tokens);
        if( tokens.length > 1) {
          HTMLResult = `<span class="header1">${tokens[0]}</span>`;
        }
        if( tokens.length > 2) {
          HTMLResult = HTMLResult.concat(` - <span class="header2">${tokens[1]}</span>`);
        }
        if( tokens.length > 3) {
          HTMLResult = HTMLResult.concat(` - <span class="header3">${tokens[2]}</span>`);
        }
        if( tokens.length > 4) {
          var str = tokens.slice(3,tokens.length - 1).join('/');
          HTMLResult = HTMLResult.concat(` - <span class="header4">${str}</span>`);
        }
      }
      this.HTMLHeader = HTMLResult;
    }
  },

  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
  mounted : function(){
    // get the desktop item index from the route query param
    this.desktopItemIndex = this.$route.query.index;
    // find the desktop item in the store
    var dkItem = store.getters.desktopItemByIndex(this.desktopItemIndex);

    this.scan = dkItem.data;
    this.filename = dkItem.filename;

    // build the summary view
    var summary = this.scan.tomcat.map( tc => {
      var servletIndex = [];
      tc.conf.contextList.forEach(ctxList => {
        ctxList.context.forEach( ctx => {
          ctx.servlet.forEach(srv => {
            if( srv.rid ) {
              var definition = store.getters.webappDefById(srv.rid);
              if(definition) {
                servletIndex.push({
                  "id" : srv.rid,
                  "name" : definition.name,
                  "path" : ctx.path,
                  "url" : `http://${this.scan.ssh.host}:${tc.conf.connector.port}${ctx.path}`
                });
              }
            }
          });
        });
      });
      return {
        "id" : tc.id,
        "port" : tc.conf.connector.port,
        "version" : tc.prop.find(p => p.name === "Server version"),
        "servlet" : servletIndex
      };
    });
    console.log(summary);
    this.summary = summary;
    this.buildHTMLHeader();

    // activate the Bootstrap Popover plugin for the update DOM
    $(function () {
      $('[data-toggle="popover"]').popover();
    });
  }
};
