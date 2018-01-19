const validate    = require('validator');
const notify      = require('../../../../../../../service/notification');
const persistence = require('../../../../../../../lib/lib').persistence;

module.exports = {
  props: ['item', 'tomcat', 'webapp','servlet'],
  components: {
    "inlineInput2": require('../../../../../../../lib/component/inline-input-2')
  },
  data: function() {
    return {
      validation: {
        "name": true,
        "urlPattern": true
      }
    };
  },
  template: require('./main.html'),
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
              use by web app <b>${existingWebapp.name}</b>`, 'warning', 'warning');
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
