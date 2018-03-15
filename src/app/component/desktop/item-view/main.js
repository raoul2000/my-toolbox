var electron    = require('electron');
var path        = require('path');
var remote      = require('electron').remote;
var validate    = require('validator');
const { spawn } = require('child_process');
const store     = require('../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
const config    = require('../../../service/config');
const notify    = require('../../../service/notification');

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
    currentTabName : function() {
      return this.$route.name;
    },
    view : function() {
      return this.$store.getters['view/findById'](VIEW_ID);
    }
  },
  methods : {
    /**
     * Start putty.exe application
     * Only the ip/host is required. All other parameters are optionals and can be entered
     * by the user
     */
    openPuttySession : function() {
      let ssh = this.item.data.ssh; // shortcut
      // build the command line argument list depending on what fields are provided
      if( ! validate.isEmpty(ssh.host)) {
        let cmdArg = [  "-ssh"];

        if(  ! validate.isEmpty(ssh.username)) {
          cmdArg.push(`-l "${ssh.username}"`);
          if( ! validate.isEmpty(ssh.password)) {
            cmdArg.push(`-pw "${ssh.username}"`);
          }
        }
        cmdArg.push( ! validate.isEmpty(ssh.port+'')  ? `-P ${ssh.port}` : "-P 22");
        cmdArg.push(ssh.host);

        // run PUTTY
        console.log(cmdArg);
        spawn(`"${config.store.get('puttyFilePath')}"`, cmdArg , { shell: true });
        // TODO : error handler if command fails (program file not found)
      } else {
        // no ip address available : error (sorry)
        notify('No IP address or hostname provided','error','Error');
      }
    },
    /**
     * Start winscp.exe application.
     * Only the ip/host is required. All other parameters are optionals and can be entered
     * by the user
     */
    openWinscpSession : function() {
      let ssh = this.item.data.ssh; // shortcut
      if( ! validate.isEmpty(ssh.host)) {

        let uri = "sftp://";
        if( ! validate.isEmpty(ssh.username) ) {
          uri = uri.concat(ssh.username);
          if( ! validate.isEmpty(ssh.password)) {
            uri = uri.concat(`:${ssh.password}`);
          }
          uri = uri.concat("@");
        }
        uri = uri.concat(ssh.host);
        if( ! validate.isEmpty(ssh.port+'') ) {
          uri = uri.concat(`:${ssh.port}`);
        }
        console.log(uri);
        spawn(`"${config.store.get('winscpFilePath')}"`, [ uri ] , { shell: true });
      }  else {
        // no ip address available : error (sorry)
        notify('No IP address or hostname provided','error','Error');
      }
    },
    /**
     * User click on webapp tab
     */
    "openTabWebapp" : function() {
      this.$router.push('webapps');
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
