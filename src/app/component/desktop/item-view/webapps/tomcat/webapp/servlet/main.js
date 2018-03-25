const validate    = require('validator');

const persistence = require('../../../../../../../service/persistence');
const service     = require('../../../../../../../service/service').service;
const shell       = require('electron').shell;

module.exports = {
  props: ['item', 'tomcat', 'webapp','servlet'],
  components: {
    "inlineInput2": require('../../../../../../../lib/component/inline-input-2')
  },
  data: function() {
    return {
      validation: {
        "name"        : true,
        "class"       : true,
        "urlPatterns" : true
      }
    };
  },
  template: require('./main.html'),
  computed : {
    servletURL: function() {
      return `http://${this.item.data.ssh.host}:${this.tomcat.port}${this.webapp.contextPath}${this.servlet.urlPatterns[0]}`;
    },
    displayUrlPatterns : function() {
      return this.servlet.urlPatterns.join(' ');
    },
    btTitleOpenServletURL : function() {
      return "Open ".concat(this.servletURL);
    }
  },
  methods: {
    openServletURL : function() {
      shell.openExternal(this.servletURL);
    },
    deleteServlet : function() {
      let self = this;
      service.notification.confirm(
        'Confirmation Needed',
        `Are you sure you want to delete the servlet <code>${self.servlet.name}</code>?`
      )
      .on('confirm', ()=> {
        self.$store.commit('deleteServlet', {
          "item"      : self.item,
          "tomcat"    : self.tomcat,
          "webapp"    : self.webapp,
          "servlet"   : self.servlet
        });
        persistence.saveDesktopItemToFile(self.item);
      });
    },
    changeValue: function(arg) {
      let actualValue = arg.value;
      if( arg.name === "urlPatterns" ) {
        actualValue = arg.value.split(' ');
      }
      let updateInfo = {
        "item"      : this.item,
        "tomcat"    : this.tomcat,
        "webapp"    : this.webapp,
        "servlet"   : this.servlet,
        "updateWith": {}
      };
      updateInfo.updateWith[arg.name] = actualValue;
      this.$store.commit('updateServlet', updateInfo);
      // FIXME : in some case (to define) the JSON saved by next line is INVALID
      // with additional closing brackets or some other characters
      persistence.saveDesktopItemToFile(this.item);
    }
  }
};
