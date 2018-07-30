var electron    = require('electron');
var path        = require('path');
var remote      = require('electron').remote;
var validate    = require('validator');
const { spawn } = require('child_process');
const store     = require('../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
const service   = require('../../../service/index');
const runExt   = require('../../../lib/run-external').run;


const VIEW_ID = "item-view";

module.exports = {
  store,
  components : {
    "color-picker"    : require('vue-color').Chrome,
    "general-info"   : require('./general-info/main')
  },  
  data : function(){
    return {
      htmlHeader  : '',
      item        : null,
      colors      : '#333',
      optionColor : 'auto'
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
    updateColorValue : function(arg) {
      this.colors = arg;
    },
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
    "openTabNotes" : function() {
      this.$router.push('notes');
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
    "openColorPicker" : function() {
      $('#color-picker-modal').modal("show");
      
    },
    "saveColor" : function(){
      console.log(`saving updateColorValue :  type = ${this.optionColor}`);
      console.log(this.colors);
      let selectedColor = typeof this.colors === "object" ? this.colors.hex : this.colors;

      let itemColor = null;
      if( this.optionColor === 'manual') {
        itemColor = selectedColor;
      } 
      if( this.item.data.color !== itemColor) {
        store.commit('updateDesktopItem', {
          id         : this.item.data._id,
          updateWith : {
            color : itemColor
          }
        });
        service.persistence.saveDesktopItemToFile(this.item);
      }

      $('#color-picker-modal').modal('hide');
    },
    /**
     * Create the HTML sub header out of the desktop item relative file path.
     */
    buildHTMLHeader : function() {
      this.htmlHeader = this.item.path.concat([
        `<span class="label" style="background-color : ${service.ui.getItemColor(this.item)}">
          ${this.item.name}
        </span>`
      ]).join(' / ');
    },
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
    if( this.item.data.color) {
      this.colors = this.item.data.color;
      this.optionColor = 'manual';
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
