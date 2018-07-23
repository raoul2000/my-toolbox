var electron    = require('electron');
var path        = require('path');
var remote      = require('electron').remote;
var validate    = require('validator');
const { spawn } = require('child_process');
const store     = require('../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
//const config    = require('../../../service/config');
const service   = require('../../../service/index');
const runExt   = require('../../../lib/run-external').run;

const VIEW_ID = "item-view";

module.exports = {
  store,
  data : function(){
    return {
      htmlHeader : '',
      item       : null
    };
  },
  template : require('./main.html'),
  computed : {
    toolbarItems : function() {
      return service.config.store.get('toolbar');
    },
    currentTabName : function() {
      return this.$route.name;
    },
    view : function() {
      return this.$store.getters['view/findById'](VIEW_ID);
    },
    webappCount : function() {
      let count = this.item.data.tomcats.reduce( (acc, tomcat) => {
        return acc + tomcat.webapps.length;
      },0);
      return count !== 0
        ? count
        : "";
    },
    componentCount : function() {
      return this.item.data.components.length !== 0
        ? this.item.data.components.length
        : "";
    }
  },
  methods : {
    /**
     * Execute an external program configured in the toolbar.
     */
    runToolbarAction : function(actionId) {
      
      let action = service.config.store.get('toolbar').find( action => action.id === actionId);
      if(action) {
        let ssh = this.item.data.ssh; // shortcut
        runExt(action.command, {
          "PORT" : ssh.port,
          "HOST" : ssh.host,
          "USERNAME" : ssh.username,
          "PASSWORD" : ssh.password
        })
        .catch( (err) => {
          console.error(err);
          service.notification.error(
            `failed to run ${action.label}`
          );
        });        
      }
    },
    /**
     * User click on webapp tab
     */
    "openTabWebapp" : function() {
      this.$router.push('webapps');
    },
    /**
     * User click on Entitites tab
     */
    "openTabEntities" : function() {
      this.$router.push('entitites');
    },
    /**
     * User click on 'settings' tab
     */
    "openTabHome" : function() {
      this.$router.push('settings');
    },
    /**
     * User click on 'component' tab
     */
    "openTabComponents" : function() {
      this.$router.push('components');
    },
    /**
     * User click on 'commands' tab
     */
    "openTabCommands" : function() {
      this.$router.push('commands');
    },
    /**
     * Create the HTML sub header out of the desktop item relative file path.
     */
    buildHTMLHeader : function() {
      let pathParts = [];
      // compute the container class
      let validEnv = {
        'dev'  : "bg-success",
        'qa'   : "bg-info",
        'prod' : "bg-danger"
      };
      let validEnvKeys = Object.keys(validEnv);
      if( this.item.path.length > 0 ) {
        pathParts = this.item.path
        .map( path => path.trim().toLowerCase())
        .map( path => {
          return validEnv.hasOwnProperty(path)
            ? `<span class="label ${validEnv[path]}">${path.toUpperCase()}</span>`
            : path;
        });
      }
      this.htmlHeader = pathParts.concat([`<b>${this.item.name}</b>`]).join(' / ');
    }
  },
  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
  beforeMount : function(){
    // get the desktop item index from the route query param
    let itemId = this.$route.params.id;
    // find the desktop item in the store
    this.item = store.getters.desktopItemById(itemId);
    if( ! this.item ) {
      console.warn('failed to load item : id = '+itemId);
    } else {
      this.buildHTMLHeader();
    }

    // persistent view state ////////////////////////////////////////////////
    //
    if( this.view ) {
      this.$store.commit('view/delete',{
        "id": VIEW_ID
      });
    }
    this.$store.commit('view/add',{
      "id" : VIEW_ID
    });
  },
  mounted : function(){
    let self = this;
    // use the 'ESC' key to go back to desktop
    Mousetrap.bind('esc', function(){
      Mousetrap.unbind('esc', 'keyup');
      self.$router.push('/desktop');
      return false; // prevent default ans bubbling
    }, 'keyup');
  }
};
