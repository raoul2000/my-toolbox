var electron    = require('electron');
var path        = require('path');
var remote      = require('electron').remote;
const store     = require('../../../service/store/store');
const config    = require('../../../service/config');
const notify    = require('../../../service/notification');
const { spawn } = require('child_process');

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
     */
    openPuttySession : function() {
      let ssh = this.item.data.ssh; // shortcut
      let cmdArg = [
        "-ssh",
        `-P ${ssh.port}`,
        `-l "${ssh.username}"`,
        `-pw "${ssh.password}"`,
        ssh.host
      ];
      console.log(cmdArg);
      spawn(`"${config.store.get('puttyFilePath')}"`, cmdArg , { shell: true });
      // TODO : error handler if command fails (program file not found)
    },
    /**
     * Start winscp.exe application
     */
    openWinscpSession : function() {
      let ssh = this.item.data.ssh; // shortcut
      let uri = `sftp://${ssh.username}:${ssh.password}@${ssh.host}:${ssh.port}`;
      console.log(uri);
      spawn(`"${config.store.get('winscpFilePath')}"`, [ uri ] , { shell: true });
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
    this.name = this.item.data.name;

    this.buildPageHeader();
  }
};
