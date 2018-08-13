module.exports = `
<div>

  <div class="row" style="margin-top:1.5em;">
  
    <div v-if="item != null" class="col-xs-12">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">
            <i class="fa fa-sticky-note-o" aria-hidden="true"></i> Notes
          </h3>
        </div>
        <inlineTextarea
          :initialValue="item.data.notes"
          :valid="validation.notes"
          :allowEdit="!isReadOnly"
          inputType="markdown"
          valueName="notes"
          emptyValue="enter a note..."
          v-on:changeValue="changeNotesValue"/>
      </div>
    </div>

  </div>
</div>
`;
