const store     = require('../../../../../service/store/store'); // TODO : nod needed as already injected by parent (to check)
var persistence = require('../../../../../lib/lib').persistence;
const validate = require('validator');
const notify   = require('../../../../../service/notification');

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
