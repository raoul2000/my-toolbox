
const validate = require('../../../../lib/validation');

function checkIsIPV4(entry) {
  var blocks = entry.split(".");
  if(blocks.length === 4) {
    return blocks.every(function(block) {
      return parseInt(block,10) >=0 && parseInt(block,10) <= 255;
    });
  }
  return false;
}


var InlineInput = {
  template : `
  <div
    class="inline-input"
    v-bind:class="{ 'inline-editing' : editing, 'inline-validation-error' : !valid}">

    <span
      v-if="inputType == 'text'"
      v-show="!editing" >{{currentVal}}</span>
    <span
      v-else-if=" inputType == 'password'"
      v-show="!editing" >********</span>
      
    <input v-if="inputType == 'text' || inputType == 'password'" ref="input" v-show="editing" :type="inputType" v-on:blur="stopEdit" v-on:keyup.enter="stopEdit"/>
    <textarea v-else ref="input" v-on:blur="stopEdit" v-on:keyup.enter="stopEdit" />
    <span
      v-if="! editing"
      v-on:click="startEdit"
      title="edit"
      class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
    <span
      v-if="! valid"
      title="invalid input"
      class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red"></span>
  </div>`,
  props : {
    "initialValue" : [String, Number],
    "valueName"    : [String, Number],
    "valid"        : [Boolean],
    "inputType"    : [String],
  },
  data : function() {
    return {
      "editing"    : false,
      "currentVal" : this.initialValue

    };
  },
  methods : {
    startEdit : function() {
      this.editing = true;
      var inputEl = this.$refs.input;
      Vue.nextTick(function() {
        inputEl.focus();
      });
    },
    stopEdit : function() {
      this.editing = false;
      let newValue = this.$refs.input.value;
      if( newValue !== this.currentVal) {
        this.currentVal = this.$refs.input.value;
        this.$emit('changeValue',{
          "name"  : this.valueName,
          "value" : this.currentVal
        });
      }
    }
  },
  mounted : function() {
    this.$refs.input.value = this.initialValue;
  }
};



module.exports = {
  components : {
    "inlineInput" : InlineInput
  },
  data : function(){
    return {
      data : null,
      filename : "",
      editingField : '',
      validation : {
        "host"     : true,
        "username" : true,
        "password" : true,
        "port"     : true
      }
    };
  },
  template: require('./main.html'),
  methods : {
    validateHost : function(value) {
      return checkIsIPV4(value);
    },
    changeValue : function(arg){
      console.log('changeValue',arg);
      if( arg.name === "host") {
        this.validation[arg.name] = validate.isIP(arg.value);
      } else if( arg.name === "username") {
        this.validation[arg.name] = validate.isNotEmptyString(arg.value);
      }
    },
    isEditing : function(fieldName) {
      console.log(this.$refs);
      //return this.editingField === event.target.parentElement.getAttribute('data-field');
      return this.editingField === fieldName;
    },
    stopEdit : function(event) {
      console.log('stopEdit');
      this.editingField = '';
    },
    startEdit : function(event) {
      console.log('startEdit');
      this.editingField = event.target.parentElement.getAttribute('data-field');
    }
  },

  /**
   * Build the summary view for the selected desktop item. The dekstop item
   * index is passed as a route query param
   */
  mounted : function(){
    let desktopItemIndex = this.$route.params.id;
    if( desktopItemIndex === -1 ) {
      console.error("missing desktopn item index");
      return;
    }
    this.desktopItemIndex = this.$route.params.id;
    // find the desktop item in the store
    let dkItem = this.$store.getters.desktopItemByIndex(desktopItemIndex);
    this.data = dkItem.data;
    this.filename = dkItem.filename;
  }
};
