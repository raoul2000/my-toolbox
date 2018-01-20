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
    }
  }
};
