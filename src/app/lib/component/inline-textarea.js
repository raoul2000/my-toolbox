var markdown = require( "markdown" ).markdown;

module.exports = {
  template : `
  <div
    class="inline-textarea"
    v-on:click="startEdit"
    v-bind:class="{ 'inline-editing' : editing, 'inline-validation-error' : !valid}">

    <span
      v-if="! editing"
      v-on:click="startEdit"
      title="edit"
      style="float:left"
      class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
    <span
      v-if="! valid"
      title="invalid input"
      class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red"></span>


    <div v-if="!editing">
      <div v-if="inputType=='markdown'" v-html="currentVal" />
      <div v-else class="current-value">{{currentVal}}</div>
    </div>
    <textarea v-else  v-on:blur="stopEdit" v-on:keyup.esc="stopEdit"/>

  </div>`,
  props : {
    "initialValue" : [String, Number],
    "valueName"    : [String, Number],
    "inputType"    : {
      type : String,
      default : "text" // text | markdown
    },
    "valid"        : [Boolean],
  },
  data : function() {
    return {
      "editing"       : false,
      "rawCurrentVal" : this.initialValue,
      "fieldElement"  : null
    };
  },
  computed : {
    currentVal : {
      get : function(){
        console.log('get current val');
        if( this.editing ) {
          return this.rawCurrentVal;
        } else if( this.inputType === "markdown") {
          return markdown.toHTML(this.rawCurrentVal);
        } else {
          return this.rawCurrentVal;
        }
      },
      set : function(val) {
        this.rawCurrentVal = val;
      }
    }
  },
  methods : {
    startEdit : function() {
      this.editing = true;
      var self = this;
      Vue.nextTick(function() {
        self.fieldElement = self.$el.querySelector('textarea');
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
