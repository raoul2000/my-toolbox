const store     = require('../../../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
var persistence = require('../../../../../service/persistence');
const validate  = require('validator');
const notify    = require('../../../../../service/notification');
const service   = require('../../../../../service/service').service;

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
    runCmdTask : function(){
      return  this.$store.getters['tmptask/taskById'](this.runCmdTaskId);
    },
  },
  methods : {
    runCommand : function() {
      let self = this;
      this.allowEdit = false;
      service.command.runCommand(this.item.data,this.command._id)
      .then( result => {
        debugger;
        self.cmdResult = result;
        service.command.finalize(this.command);
        self.allowEdit = true;
      });

    },
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
        persistence.saveDesktopItemToFile(self.item);
      });
    },
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
      persistence.saveDesktopItemToFile(this.item);
    }
  },
  mounted : function() {
    this.runCmdTaskId = service.command.buildTaskId(this.command);
  }
};
