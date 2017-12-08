var markdown = require( "markdown" ).markdown;

module.exports = {
  template : `
  <div
    class="inline-input"
    v-on:click="startEdit"
    v-bind:class="{ 'inline-editing' : editing, 'inline-validation-error' : !valid}">

    <span v-if="inputType == 'text'" class="inline-ctrl-text">
      <span v-if="!editing" class="current-value">{{currentVal}}</span>
      <input v-else type="text" v-on:blur="stopEdit" v-on:keyup.enter="stopEdit"/>
    </span>
    <span v-else-if="inputType == 'password'" class="inline-ctrl-password">
      <span v-if="!editing" class="current-value">{{hiddenPassword}}</span>
      <input v-else type="password" v-on:blur="stopEdit" v-on:keyup.enter="stopEdit"/>
    </span>

    <span
      v-if="! editing"
      v-on:click="startEdit"
      title="edit"
      style="float:right"
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
    "inputType"    : [String], // text, password
  },
  data : function() {
    return {
      "editing"      : false,
      "currentVal"   : this.initialValue,
      "fieldElement" : null
    };
  },
  computed : {
    hiddenPassword : function(){
      return this.currentVal && this.currentVal.length !== 0 ? new Array(this.currentVal.length + 1).join( '*' ) : '';
    }
  },
  methods : {
    startEdit : function() {
      this.editing = true;
      var self = this;
      Vue.nextTick(function() {
        self.fieldElement = self.$el.querySelector('input');
        self.fieldElement.value = self.currentVal;
        self.fieldElement.focus();
      });
    },
    stopEdit : function() {
      this.editing = false;
      let newValue = this.fieldElement.value;
      if( newValue !== this.currentVal) {
        this.currentVal =  newValue;
        this.$emit('changeValue',{
          "name"  : this.valueName,
          "value" : newValue
        });
      }
    }
  }
};
