module.exports = `
<div>

  <div class="row" style="margin-top:1.5em;">

    <div v-if="item != null " class="col-xs-3">

      <div class="panel panel-default">

        <div class="panel-heading">
          <h3 class="panel-title">
            <span class="glyphicon glyphicon-th" aria-hidden="true"></span> Connection
          </h3>
        </div>
        
        <ul class="general-info">
          <li>
            <div class="field-name">host</div>
            <div class="field-value">
              <inlineInput
                :initialValue="item.data.ssh.host"
                :valid="validation.host"
                :allowEdit="allowEdit"
                inputType="text"
                valueName="host"
                emptyValue="<em class='text-muted'>???.???.???.???</em>"
                v-on:changeValue="changeSSHValue"/>
            </div>
          </li>
          <li>
            <div class="field-name">username</div>
            <div class="field-value">
              <inlineInput
                :initialValue="item.data.ssh.username"
                :valid="validation.username"
                :allowEdit="allowEdit"
                inputType="text"
                valueName="username"
                emptyValue="<em class='text-muted'>(no username)</em>"
                v-on:changeValue="changeSSHValue"/>
            </div>
          </li>
          <li>
            <div class="field-name">password</div>
            <div class="field-value">
              <inlineInput
                :initialValue="item.data.ssh.password"
                :valid="validation.password"
                :allowEdit="allowEdit"
                inputType="password"
                emptyValue="<em class='text-muted'>(no password)</em>"
                valueName="password"
                v-on:changeValue="changeSSHValue"/>
            </div>
          </li>
          <li>
            <div class="field-name">SSH port</div>
            <div class="field-value">
              <inlineInput
                :initialValue="item.data.ssh.port"
                :valid="validation.port"
                :allowEdit="allowEdit"
                inputType="text"
                valueName="port"
                v-on:changeValue="changeSSHValue"/>
            </div>
          </li>
        </ul>
        <button
          v-bind:disabled="!canTestConnection"
          v-on:click="testConnection" type="button" class="btn btn-default btn-block">
            <i v-show="allowEdit === false" class="fa fa-refresh fa-spin"></i>
            <span v-show="connectionOk !== null">
              <span v-show="connectionOk === true" class="glyphicon glyphicon-ok" aria-hidden="true"></span>
              <span v-show="connectionOk === false" class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red"></span>
            </span>

            &nbsp;Test Connection
        </button>


      </div><!-- end of panel -->
    </div>

    <div v-if="item != null" class="col-xs-9">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">
            <i class="fa fa-sticky-note-o" aria-hidden="true"></i> Notes
          </h3>
        </div>
        <inlineTextarea
          :initialValue="item.data.notes"
          :valid="validation.notes"
          inputType="markdown"
          valueName="notes"
          emptyValue="enter a note..."
          v-on:changeValue="changeNotesValue"/>
      </div>
    </div>

  </div>
</div>
`;
