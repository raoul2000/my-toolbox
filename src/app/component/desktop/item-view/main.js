var electron = require('electron');
var path = require('path');
var remote = require('electron').remote;
const store    = require('../../../service/store/store');

module.exports = {
  props: ['message'],
  store,
  data : function(){
    return {
      filename : null,
      HTMLHeader : '',
      name : ''
    };
  },
  template: require('./main.html'),
  methods : {
    "openTabProfile" : function() {
      this.$router.push('profile');
    },
    "openTabHome" : function() {
      this.$router.push('settings');
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
    console.log('mounted');
    this.desktopItemIndex = this.$route.params.id;
    // find the desktop item in the store
    var dkItem = store.getters.desktopItemByIndex(this.desktopItemIndex);

    this.filename = dkItem.filename;
    this.name = dkItem.data.name;
    this.buildHTMLHeader();
  }
};
