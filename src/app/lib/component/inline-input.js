

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
      <span v-if="!editing" class="current-value">********</span>
      <input v-else type="password" v-on:blur="stopEdit" v-on:keyup.enter="stopEdit"/>
    </span>
    <span v-else-if="inputType == 'textarea'" class="inline-ctrl-textarea">
      <span v-if="!editing" class="current-value">{{currentVal}}</span>
      <textarea v-else  v-on:blur="stopEdit" v-on:keyup.esc="stopEdit"/>
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
    "inputType"    : [String],
  },
  data : function() {
    return {
      "editing"      : false,
      "currentVal"   : this.initialValue,
      "fieldElement" : null
    };
  },
  methods : {
    startEdit : function() {
      this.editing = true;
      var self = this;
      Vue.nextTick(function() {
        let inputElementName = self.inputType === 'textarea' ? 'textarea' : 'input';
        self.fieldElement = self.$el.querySelector(inputElementName);
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
  },
  mounted : function() {
  }
};
