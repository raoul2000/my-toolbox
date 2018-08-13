var markdown = require( "markdown" ).markdown;
var autosize = require('autosize');

module.exports = {
  template : `
  <div
    class="inline-textarea"
    v-on:click="startEdit"
    v-bind:class="{ 'inline-editing' : editing, 'inline-validation-error' : !valid}">

    <span
      v-if="! editing && allowEdit"
      v-on:click="startEdit"
      title="edit"
      style="float:left"
      class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
    <span
      v-if="! valid"
      title="invalid input"
      class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red"></span>


    <div v-if="!editing ">
      <div v-if="inputType=='markdown'" class="html-value" v-html="displayValue" />
      <div v-else class="text-value">{{currentVal}}</div>
    </div>
    <textarea
      v-else
      id="inline-textarea-element"
      v-on:blur="stopEdit"
      v-on:keyup.esc="stopEdit"
      placeholder="type your text here ..."
      rows="4"/>

  </div>`,
  props : {
    "initialValue" : [String, Number],
    "valueName"    : [String, Number],
    "inputType"    : {
      type : String,
      default : "text" // text | markdown
    },
    "valid"        : [Boolean],
    "emptyValue"   : [ String ],
    "allowEdit"    : {
      "type"    : Boolean,
      "default" : true
    }    
  },
  data : function() {
    return {
      "editing"       : false,
      "currentVal"    : "".concat(this.initialValue),
      "fieldElement"  : null
    };
  },
  computed : {
    displayValue : function(){
      let val = "";
      if( (this.emptyValue && this.emptyValue.length !== 0) && this.currentVal.length === 0 ) {
        val = this.emptyValue;
      } else {
        val = this.inputType === 'markdown'
          ? markdown.toHTML(this.currentVal)
          : this.currentVal;
      }
      return val;
    }
  },
  methods : {

    startEdit : function() {
      if( this.allowEdit === false) {
        return;
      }      
      var self = this;
      this.currentVal = this.currentVal.trim();
      this.editing = true;  // start edit now
      Vue.nextTick(function() {
        self.fieldElement = self.$el.querySelector('textarea');
        self.fieldElement.value = self.currentVal;
        self.fieldElement.focus();
        autosize(self.fieldElement);
      });
    },
    stopEdit : function() {
      if( this.allowEdit === false) {
        return;
      }      
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
