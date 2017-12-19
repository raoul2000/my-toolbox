

module.exports = {
  template : `
  <div
    class="inline-input"
    v-on:click="startEdit"
    v-bind:class="{ 'inline-editing' : editing, 'inline-validation-error' : !valid}">

    <span v-if="inputType == 'text'" class="inline-ctrl-text">
      <span v-if="!editing" class="current-value" v-html="displayValue"></span>
      <input v-else type="text" v-model="inputValue" v-on:blur="stopEdit" v-on:keyup.enter="stopEdit"/>
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
    "value"        : [String, Number],
    "valueName"    : [String, Number],
    "valid"        : [Boolean],
    "inputType"    : [String], // text, password
    "emptyValue"   : [String]
  },
  data : function() {
    return {
      "editing"      : false,
      "fieldElement" : null,
      "inputValue"   : ""
    };
  },
  computed : {
    hiddenPassword : function(){
      return this.value && this.value.length !== 0 ? new Array(this.value.length + 1).join( '*' ) : '';
    },
    displayValue : function(){
      return (this.emptyValue && this.emptyValue.length !== 0) && this.value.length === 0
        ? this.emptyValue
        : this.value;
    }
  },
  methods : {
    startEdit : function() {
      this.inputValue = "".concat(this.value);
      this.editing = true;
      var self = this;
      Vue.nextTick(function() {
        self.fieldElement = self.$el.querySelector('input');
        self.fieldElement.focus();
      });
    },
    /**
     * Edit is done.
     * Send a custom event to parent component in order to update the value.
     * Note that this.value is NEVER updated by this component, and must be updated
     * by the parent component.
     */
    stopEdit : function() {
      this.editing = false;
      let newValue = this.fieldElement.value.trim();
      if( newValue !== this.value ) {
        this.$emit('changeValue',{
          "name"  : this.valueName,
          "value" : newValue
        });
      }
    }
  }
};
