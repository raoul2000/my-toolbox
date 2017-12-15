const validate = require('validator');
const notify   = require('../../../../../../service/notification');
var persistence = require('../../../../../../lib/lib').persistence;

module.exports = {
  props: ['item', 'tomcat', 'webapp'],
  components: {
    "inlineInput": require('../../../../../../lib/component/inline-input'),
  },
  data: function() {
    return {
      validation: {
        "name": true,
        "path": true
      }
    };
  },
  template: require('./main.html'),
  computed: {
    webappURL: function() {
      return `http://${this.item.data.ssh.host}:${this.tomcat.port}${this.webapp.path}`;
    }
  },
  methods: {
    deleteWebapp : function() {
      let self = this;
      (new PNotify({
          title: 'Confirmation Needed',
          text: `Are you sure you want to delete the webapp <code>${self.webapp.name}</code>?`,
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
        self.$store.commit('deleteWebapp', {
          "item"      : self.item,
          "tomcat"    : self.tomcat,
          "webapp"    : self.webapp
        });
        persistence.saveDesktopnItemToFile(self.item);
      });

    },
    changeValue: function(arg) {
      if (arg.name === "path") {
        if (validate.isEmpty(arg.value)) {
          this.validation.path = false;
        } else {
          // check duplicate path
          let existingWebapp = this.tomcat.webapps.find(webapp => webapp.path === arg.value);
          if (existingWebapp) {
            notify(`The path <b>${arg.value}</b> is already in
              use by web app <b>${existingWebapp.name}</b>`, 'error', 'error');
            this.validation.path = false;
          } else {
            this.validation.path = true;
          }
        }
      }
      // webapp.name is always valid (even if empty)
      let updateInfo = {
        "item"      : this.item,
        "tomcat"    : this.tomcat,
        "webapp"    : this.webapp,
        "updateWith": {}
      };
      updateInfo.updateWith[arg.name] = arg.value;
      this.$store.commit('updateWebapp', updateInfo);
      persistence.saveDesktopnItemToFile(this.item);
    }
  }
};
