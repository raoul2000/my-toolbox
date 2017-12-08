var electron    = require('electron');
var path        = require('path');
var remote      = require('electron').remote;
var validate    = require('validator');
const { spawn } = require('child_process');
const store     = require('../../../service/store/store');
const config    = require('../../../service/config');
const notify    = require('../../../service/notification');

module.exports = {
  store,
  data : function(){
    return {
      filename   : null,
      pageHeader : '',
      name       : '',
      activeTab  : 'settings',
      item       : null
    };
  },
  template: require('./main.html'),
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
    "openTabProfile" : function() {
      this.$router.push('profile');
      this.activeTab = "profile";
    },
    "openTabHome" : function() {
      this.activeTab = "settings";
      this.$router.push('settings');
    },
    /**
     * Create the HTML page header out of the desktop item relative file path.
     */
    buildPageHeader : function() {

      let subtitle = this.item.path.length > 0 ? this.item.path.join(' - ') : "";

      // compute the container class
      let validEnv = {
        'dev'  : "bg-success",
        'qa'   : "bg-info",
        'prod' : "bg-danger"
      };
      let validEnvKeys = Object.keys(validEnv);
      let classes = [ "project"];
      let thisEnv = this.item.path
        .filter( token => validEnvKeys.indexOf(token.toLowerCase()) > -1 )
        .map( token => token.toLowerCase());
      let subtitleClass = thisEnv.length === 0 ? "bg-default" : validEnv[thisEnv[0]];

      this.pageHeader = `<div class="sub-title ${subtitleClass}">${subtitle}</div>`;
    }
  },
  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
  mounted : function(){
    // get the desktop item index from the route query param
    console.log('mounted');
    this.desktopItemIndex = this.$route.params.id;
    // find the desktop item in the store
    this.item = store.getters.desktopItemByIndex(this.desktopItemIndex);

    this.filename = this.item.filename;
    this.name = this.item.name;

    this.buildPageHeader();
  }
};
