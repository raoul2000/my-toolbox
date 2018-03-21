

module.exports = {
  template : `
  <div
    class="inline-input"
    v-on:click="startEdit"
    v-bind:class="{ 'inline-editing' : editing, 'inline-validation-error' : !valid}">

    <span v-if="inputType == 'text'" class="inline-ctrl-text">
      <span v-if="!editing"
        class="current-value"
        v-html="displayValue"
        tabindex="0"
        v-on:keyup.enter="startEdit"></span>
      <input v-else
        type="text"
        v-on:blur="stopEdit"
        v-on:keyup.esc="cancelEdit"
        v-on:keyup.enter="stopEdit"/>
    </span>

    <span v-else-if="inputType == 'password'" class="inline-ctrl-password">
      <span v-if="!editing"
        class="current-value"
        tabindex="0"
        v-html="hiddenPassword"
        v-on:keyup.enter="startEdit" />
      <input v-else
        type="password"
        v-on:blur="stopEdit"
        v-on:keyup.esc="cancelEdit"
        v-on:keyup.enter="stopEdit"/>
    </span>

    <span
      v-if="! editing && allowEdit "
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
    "emptyValue"   : [String],
    "allowEdit"    : {
      "type"    : Boolean,
      "default" : true
    }
  },
  data : function() {
    return {
      "editing"        : false,
      "currentVal"     : "".concat(this.initialValue),
      "fieldElement"   : null,
      "isCancelEdit"   : false  // handle edition cancel on ESC key press
    };
  },
  watch : {
    /**
     * On initialValue Change, force Update
     */
    initialValue : function() {
      this.forceUpdate(this.initialValue);
    }
  },
  computed : {
    hiddenPassword : function(){
      //return this.currentVal && this.currentVal.length !== 0 ? new Array(this.currentVal.length + 1).join( '*' ) : '';
      return (this.emptyValue && this.emptyValue.length !== 0) && this.currentVal.length === 0
        ? this.emptyValue
        : "********";
    },
    displayValue : function(){
      return (this.emptyValue && this.emptyValue.length !== 0) && this.currentVal.length === 0
        ? this.emptyValue
        : this.currentVal;
    }
  },
  methods : {
    /**
     * Handle value update not triggered by user input, but by parent component.
     */
    forceUpdate : function(value) {
      this.currentVal =  value;
      this.$emit('changeValue',{
        "name"  : this.valueName,
        "value" : value
      });
    },
    /**
     * User is starting edition : the input element is displayed if edition is allowed
     */
    startEdit : function() {
      if( ! this.allowEdit ) {
        return;
      }
      this.editing = true;
      this.isCancelEdit = false;
      this.currentVal = this.currentVal.trim();
      var self = this;
      Vue.nextTick(function() {
        self.fieldElement = self.$el.querySelector('input');
        self.fieldElement.value = self.currentVal;
        self.fieldElement.focus();
      });
    },
     /**
      * Edit is done : user ends input
      * Send a custom event to parent component in order to update the value.
      * Note that this.value is NEVER updated by this component, and must be updated
      * by the parent component.
      */
    stopEdit : function() {
      if( this.isCancelEdit || ! this.allowEdit ) {
        return;
      }
      this.editing = false;
      let newValue = this.fieldElement.value.trim();
      if( newValue !== this.currentVal ) {
        this.currentVal =  newValue;
        this.$emit('changeValue',{
          "name"  : this.valueName,
          "value" : newValue
        });
      }
    },
    /**
     * User canceled edition.
     * Restore the current value and close the eidtion mode
     */
    cancelEdit : function() {
      if( ! this.allowEdit ) {
        return;
      }
      this.isCancelEdit = true; // disable the call to this.stopEdit
      this.editing      = false;
    }
  }
};
