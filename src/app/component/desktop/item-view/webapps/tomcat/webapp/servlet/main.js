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
        "name"       : true,
        "class"      : true,
        "urlPattern" : true
      }
    };
  },
  template: require('./main.html'),
  methods: {
    changeValue: function(arg) {
      let updateInfo = {
        "item"      : this.item,
        "tomcat"    : this.tomcat,
        "webapp"    : this.webapp,
        "servlet"   : this.servlet,
        "updateWith": {}
      };
      updateInfo.updateWith[arg.name] = arg.value;
      this.$store.commit('updateServlet', updateInfo);
      // FIXME : in some case (to define) the JSON saved by next line is INVALID
      // with additional closing brackets or some other characters
      persistence.saveDesktopnItemToFile(this.item);

    }
  }
};
