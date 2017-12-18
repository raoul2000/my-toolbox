const store     = require('../../../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
var persistence = require('../../../../../lib/lib').persistence;
const validate  = require('validator');
const notify    = require('../../../../../service/notification');

module.exports = {
  props: ['item', 'component'],
  components: {
    "inlineInput": require('../../../../../lib/component/inline-input'),
  },
  store,
  data : function(){
    return {
      disableAction : false,
      validation: {
        "name": true
      }
    };
  },
  template: require('./main.html'),
  methods : {
    deleteComponent : function() {
      let self = this;
      (new PNotify({
          title: 'Confirmation Needed',
          text: `Are you sure you want to delete the component <code>${self.component.name}</code>?`,
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
        self.$store.commit('deleteComponent', {
          "item"      : self.item,
          "component" : self.component
        });
        persistence.saveDesktopnItemToFile(self.item);
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
        "component" : this.component,
        "updateWith": {}
      };
      updateInfo.updateWith[arg.name] = arg.value;
      this.$store.commit('updateComponent', updateInfo);
      persistence.saveDesktopnItemToFile(this.item);
    }
  }
};