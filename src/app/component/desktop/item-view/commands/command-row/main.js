const store     = require('../../../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
const validate  = require('validator');
const service   = require('../../../../../service/index');

module.exports = {
  props: ['item', 'command'],
  components: {
    "inlineInput": require('../../../../../lib/component/inline-input'),
  },
  store,
  data : function(){
    return {
      disableAction : false,
      validation    : {
        "name"   : true,
        "source" : true
      },
      runCmdTaskId : "",
      allowEdit    : true,
      cmdResult    : null
      
    };
  },
  template: require('./main.html'),
  computed : {
    /**
     * Return the command execution task linked with this component.
     * The task Id is initialized when the component is mounted
     */
    runCmdTask : function(){
      return  this.$store.getters['tmptask/taskById'](this.runCmdTaskId);
    },
    borderColor : function() {
      if(this.cmdResult) {
        if (this.cmdResult.code !== 0) {
          return "red";
        } else if( this.cmdResult.code === 0 ) {
          return "green";
        }
      } else {
        return "grey";
      }
    }
  },
  methods : {
    editCommand : function() {
      let $modal     = $('#edit-cmd-modal');
      $modal.modal("show");
    },
    /**
     * Execute the command.
     * The job of actually executing the command is delegated to the service.command
     * which returns the result of command execution
     */
    runCommand : function() {
      let self = this;
      this.allowEdit = false;
      service.command.runCommand(this.item.data.ssh,this.command)
      .then( result => {
        self.cmdResult = result;
        service.command.finalize(this.command);
        self.allowEdit = true;
      });
    },
    /**
     * Delete the command associated with this component.
     * The command is removed from the store and the file used to save the
     * parent item is updated.
     */
    deleteCommand : function() {
      let self = this;
      service.notification.confirm(
        'Confirmation Needed',
        `Are you sure you want to delete the command <code>${self.command.name}</code>?`
      )
      .on('confirm', ()=> {
        self.$store.commit('deleteCommand', {
          "item"      : self.item,
          "command" : self.command
        });
        service.persistence.saveDesktopItemToFile(self.item);
      });
    },
    /**
     * Event Change handler
     */
    changeValue: function(arg) {
      if (arg.name === "name") {
        if (validate.isEmpty(arg.value)) {
          this.validation.name = false;
        } else {
          this.validation.name = true;
        }
      }
      // webapp.name is always valid (even if empty)
      let updateInfo = {
        "item"      : this.item,
        "command" : this.command,
        "updateWith": {}
      };
      updateInfo.updateWith[arg.name] = arg.value;
      this.$store.commit('updateCommand', updateInfo);
      service.persistence.saveDesktopItemToFile(this.item);
    }
  },
  mounted : function() {
    this.runCmdTaskId = service.command.buildTaskId(this.command);
  }
};
