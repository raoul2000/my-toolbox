'use strict';

const service  = require('../../../../service/index');

module.exports = {
  components : {
    "inlineTextarea" : require('../../../../lib/component/inline-textarea')
  },
  template: require('./main.html'),
  data : function(){
    return {
      item         : null,
      isReadOnly   : service.db.isReadOnly(),
      validation   : {
        "template"  : true
      },
      templateCheck : null
    };
  },
  methods : {
    createRepoConfig : function() {
      store.commit('updateDesktopItem', {
        id          : this.item.data._id,
        updateWith  : {
          repo  : {
            template : `<methodeDomain name="DOMAIN_NAME" disableSecureLogon="yes" secureLogin="no">
            <ns orbInit="-orbinitref MethodeExpress_dev_meth01=corbaloc:iiop:@${this.item.data.ssh.host}:&NS_PORT;/NameService" name="MethodeExpress_dev_meth01"/>
            <nc ncPath="/EOM/Notifiers/NotifierdevEdi" ncName="MethodeExpressEdi" popSeconds="10" pollSecondsToEomdb="60" />
          </methodeDomain>`
          }
        }
      });
      service.persistence.saveDesktopItemToFile(this.item);
    },
    deleteRepoConfig : function() {
      this.templateCheck = null;
      store.commit('updateDesktopItem', {
        id          : this.item.data._id,
        updateWith  : {
          repo  : {
            template : null
          }
        }
      });
      service.persistence.saveDesktopItemToFile(this.item);
    },
    resolveTemplate : function() {
      console.log('resolve template');
      let result = service.prime.resolveCfgTemplate({
        "template" : this.item.data.repo.template,
        "values"   : this.item.data.vars
      });
      if( result.error) {
          this.templateCheck = { 
            error : result.error
          };
      } else {
        this.templateCheck = { 
          value : result.resolvedTemplate 
        };
      }
      
    },    
    /**
     * Handle Notes update : updtae the store and the file is note have been
     * updated by user
     */
    changeTemplateValue : function(arg) {
      store.commit('updateDesktopItem', {
        id          : this.item.data._id,
        updateWith  : {
          repo  : {
            template : arg.value
          }
        }
      });
      service.persistence.saveDesktopItemToFile(this.item);
    }
  },
  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * id is passed as a path param.
   */
  beforeMount : function(){
    // find the desktop item in the store
    this.item = this.$store.getters.desktopItemById(this.$route.params.id);
    if( ! this.item ) {
      console.warn("fail to load item : id = "+this.$route.params.id);
    }
  }
};
