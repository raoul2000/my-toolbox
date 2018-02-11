

module.exports = {
  components: {
    "inlineInput2": require('../../lib/component/inline-input-2')
  },
  data: function() {
    return {
      values : {
        "field1" : "value1",
        "field2" : "value2"
      },
      validation: {
        "field1"        : true,
        "field2"        : true
      }
    };
  },
  template: require('./main.html'),
  methods: {
    changeValue: function(arg) {
      let actualValue = arg.value;
      this.values[arg.name] = arg.value;
    }
  }
};
