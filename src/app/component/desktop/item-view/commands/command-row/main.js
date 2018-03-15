const store     = require('../../../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
var persistence = require('../../../../../service/persistence');
const validate  = require('validator');
const notify    = require('../../../../../service/notification');

module.exports = {
  props: ['item', 'command'],
  components: {
    "inlineInput": require('../../../../../lib/component/inline-input'),
  },
  store,
  data : function(){
    return {
      disableAction : false,
      validation: {
        "name"   : true,
        "source" : true
      },
      runCmdTaskId : ""
    };
  },
  template: require('./main.html'),
  computed : {
    runCmdTask : function(){
      return  this.$store.getters['tmptask/taskById'](this.updateVersionTaskId);
    },
  },
  methods : {
    runCommand : function() {
      /**
      let self = this;
      this.allowEdit = false;
      version.updateTomcat(this.item.data,this.tomcat._id)
      .then( result => {
        let finalVersion = version.chooseBestResultValue(result.values);
        this.$store.commit('updateTomcat',{
          "item"       : this.item,
          "tomcat"     : this.tomcat,
          "updateWith" : {
            "version" : finalVersion.value
          }
        });
        // NOTE : it is not needed to update the file here because this will be done by a change
        // of the version value (see change() below)
        version.deleteTask(this.tomcat);
        self.allowEdit = true;
      });
*/
    },
    deleteCommand : function() {
      let self = this;
      (new PNotify({
          title: 'Confirmation Needed',
          text: `Are you sure you want to delete the command <code>${self.command.name}</code>?`,
          icon: 'glyphicon glyphicon-question-sign',
          hide: false,
          confirm: {
              confirm: true
          },
          buttons: {
              closer: false,
              sticker: false
          },
          history: {
              history: false
          },
          stack: {"dir1": "down", "dir2": "left", "modal": true, "overlay_close": true}
      })).get().on('pnotify.confirm', function() {
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
    this.runCmdTaskId = `runCmd-${this.command._id}`;
  }
};
