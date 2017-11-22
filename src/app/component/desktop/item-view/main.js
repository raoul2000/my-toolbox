var electron = require('electron');
var path = require('path');
var remote = require('electron').remote;
const store    = require('../../../service/store/store');
const { spawn } = require('child_process');

module.exports = {
  props: ['message'],
  store,
  data : function(){
    return {
      filename : null,
      HTMLHeader : '',
      name : '',
      activeTab : 'settings',
      item : null
    };
  },
  template: require('./main.html'),
  methods : {
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
      spawn('"putty.exe"', cmdArg , { shell: true });
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
     * Create the HTML header out of the desktop item relative file path.
     */
    buildHTMLHeader: function () {
      var HTMLResult = '';
      if(  this.filename) {
        //var tokens = this.filename.split(path.sep).filter( i => i.length !== 0);
        var tokens = this.item.path;
        console.log("tokens", tokens);
        if( tokens.length >= 1) {
          HTMLResult = `<span class="header1">${tokens[0]}</span>`;
        }
        if( tokens.length >= 2) {
          HTMLResult = HTMLResult.concat(` - <span class="header2">${tokens[1]}</span>`);
        }
        if( tokens.length >= 3) {
          HTMLResult = HTMLResult.concat(` - <span class="header3">${tokens[2]}</span>`);
        }
        if( tokens.length >= 4) {
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
    console.log('mounted');
    this.desktopItemIndex = this.$route.params.id;
    // find the desktop item in the store
    this.item = store.getters.desktopItemByIndex(this.desktopItemIndex);

    this.filename = this.item.filename;
    this.name = this.item.data.name;
    this.buildHTMLHeader();
  }
};
