const validate = require('validator');
const notify = require('../../../../../../service/notification');

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
    }
  }
};
