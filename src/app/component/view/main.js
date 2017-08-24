var electron = require('electron');
var remote = require('electron').remote;
const store    = require('../../service/store/store');

module.exports = {
  props: ['message'],
  data : function(){
    return {
      action : null,
      scan : {
        ssh : {
          host         : '',
          port         : 22,
          username     : '',
          password     : '',
          readyTimeout : 5000
        },
        "name"   : '',
        "entity" : [],
        "tomcat" : []
      }
    };
  },
  template: require('./main.html'),
  methods : {
    openTomcatManager  : function(tomcat) {
      var managerURL =  `http://${this.scan.ssh.host}:${tomcat.conf.connector.port}/manager/html`;
      console.info("opening Tomcat Manager : "+managerURL);
      electron.shell.openItem(managerURL);
    }
  },
  // life cycle hook
  beforeCreate : function(){
  },
  mounted : function(){
    //this.loadOptionsFromUrl();
    console.log(this.$route.query);
    var index = this.$route.query.index;
    this.scan = store.getters.desktopItemByIndex(index).data;
    console.log(this.scan);
  },
	created: function () {
  },
	beforeUpdate: function() {
		console.log('beforeUpdate');
	},
	updated : function() {
		console.log('updated: name is = '+this.name);
	}
};
