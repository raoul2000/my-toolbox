'use strict';

var service = require('../../../../service/index');

module.exports = {
  template: require('./main.html'),
  data : function(){
    return {
      item       : null,
      taskId     : null,
      filterNameText  : "",
      filterValueText : ""      
    };
  },
  computed : {
    /**
     * Get the current "refresh entities" task or NULL if no such task is available
     */
    task : function() {
      if( this.taskId) {
        return  this.$store.getters['tmptask/taskById'](this.taskId);
      } else {
        return null;
      }
    },
    /**
     * Get the list of variable names possibly filtered by user input
     * If no variable is available for the current item, returns an empty array.
     * Filters are applied in order and cumulative :
     * - by variable name
     * - by variable value
     * 
     * Filter syntax is regular expression.
     */
    filteredVars : function() {
      if( this.item.data.vars.length === 0) {
        return []; // no vars available
      } else {
        let normNameFilter = this.filterNameText.toLowerCase();
        let normValueFilter = this.filterValueText.toLowerCase();
        
        if( normNameFilter.length !== 0 || normValueFilter.length !== 0) {
          let result = this.item.data.vars;
          // the var NAME filter is applied first
          if( normNameFilter.length !== 0 ) {
            let filteredName = this.item.data.vars.filter( v => {
              return v.name.toLowerCase().match(normNameFilter);
            });
            result = filteredName;
          }

          if( normValueFilter.length !== 0 ) {
            let filteredValue = result.filter( v => {
              return v.value.toLowerCase().match(normValueFilter);
            });
            result = filteredValue;
          }
          return result;
        } else {
          return this.item.data.vars; // no filter : return all variables
        }
      }
    }
  },
  methods : {
    /**
     * Delete all vars for the current item and save it to persistent storage
     */
    deleteAllVars : function() {
      if( this.item.data.vars.length !== 0) {
        service.store.commit('updateDesktopItem', {
          id          : this.item.data._id,
          updateWith  : {
            vars  : []
          }
        });
        service.persistence.saveDesktopItemToFile(this.item);   
      }
    },
    /**
     * Performs a call to server to get the list of server entities (variable).
     * On Success, the current item is updated, and saved, otherwise an error notification
     * is displayed.
     */
    refreshEntities : function() {
      service.entities.loadFromServer(this.item.data.ssh, this.taskId)
      .then( result => {
        service.store.commit('updateDesktopItem', {
          id          : this.item.data._id,
          updateWith  : {
            vars  : result
          }
        });
        service.persistence.saveDesktopItemToFile(this.item);       
      })
      .catch( error => {
        console.error(error);
        service.notification.error(`failed to load values from server : <pre>${error.stderr}</pre>`);
      })
    }
  },
  beforeMount : function(){
    // find the desktop item in the store
    this.item = this.$store.getters.desktopItemById(this.$route.params.id);
    if( ! this.item ) {
      console.warn("fail to load item : id = "+this.$route.params.id);
    }
    this.taskId = service.entities.createTaskId();
  },
  mounted : function() {
     // keyboard shortcut to set the focus on webapp filter
     let self = this;
     Mousetrap.bind(['command+f', 'ctrl+f'], function() {
         self.$refs.inputVarNameFilter.focus();
         return false;
     });    
  }
  
}
