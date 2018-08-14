var electron    = require('electron');
var path        = require('path');
var remote      = require('electron').remote;
var validate    = require('validator');
const { spawn } = require('child_process');
const store     = require('../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
const service   = require('../../../service/index');
const runExt    = require('../../../lib/run-external').run;

const fs        = require('fs-extra');
const timestamp = require('time-stamp');

const VIEW_ID = "item-view";

module.exports = {
  store,
  components : {
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
    /**
     * Create the HTML sub header out of the desktop item relative file path.
     */
    headerHTML : function() {
      return this.item.path.concat([
        `<span class="label" style="background-color : ${service.ui.getItemColor(this.item)}">
          ${this.item.name}
        </span>`
      ]).join(' / ');
    },
    /**
     * Configured toolbar buttons
     */
    toolbarItems : function() {
      return service.config.store.get('toolbar');
    },
    /**
     * Name of the active tab - used to render the tab header
     */
    currentTabName : function() {
      return this.$route.name;
    },
    view : function() {
      return this.$store.getters['view/findById'](VIEW_ID);
    },
    /**
     * Returns the total amount of webapp for all existing tomcats
     */
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
    startPrime : function() {
      console.log("startPrime");
      service.prime.launch({
        "template" : `<methodeDomain name="LEquipe-DEV" secureLogin="no">
        <ns orbInit="-ORBInitRef LEquipe-DEV=corbaloc:iiop:10.160.86.70:3900/NameService" name="LEquipe-DEV"/>
        <nc ncPath="/EOM/Notifiers/Notifierdev01" repName="meth01_SERV1" ncName="Notifierdev01" popSeconds="10" pollSecondsToEomdb="60"/>
        <nc ncPath="/EOM/Notifiers/Notifierdev01" repName="meth01_PROD1" ncName="Notifierdev01" popSeconds="10" pollSecondsToEomdb="60"/>
      </methodeDomain>
  `});

    },
    /**
     * Execute an external program configured in the toolbar.
     */
    runToolbarAction : function(actionId) {
      service.toolbar.runExternalAction(actionId,this.item.data.ssh);
    },
    /**
     * User click on Entitites tab
     */
    "openTabEntities" : function() {
      this.$router.push('entitites');
    },
    /**
     * User click on 'component' tab
     */
    "openTabComponents" : function() {
      this.$router.push('components');
    },
    /**
     * Update color event handler - emited by the color-picker component
     * when the user chooses a color
     */
    updateColorValue : function(arg) {
      this.colors = arg;
    },
    /**
     * Opens the color picker modal 
     */    
    "openColorPicker" : function() {
      $('#color-picker-modal').modal("show");
    },
    /**
     * Invoked when the user save changes on the color picker modal.
     * If color has changedn update and save the current item
     */
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
      return;
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
