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
        <div class="panel-body text-muted">
          Info : Only the ip address is required. All other fields are optionals
        </div>


        <table class="table table-hover">
          <tbody>
            <tr>
              <th width="200px" class="field-label-right">host : </th>
              <td data-field="host">
                <inlineInput
                  :initialValue="item.data.ssh.host"
                  :valid="validation.host"
                  :allowEdit="allowEdit"
                  inputType="text"
                  valueName="host"
                  emptyValue="<em class='text-muted'>xxx.xxx.xxx.xxx</em>"
                  v-on:changeValue="changeSSHValue"/>
              </td>
            </tr>
            <tr>
              <th class="field-label-right">username : </th>
              <td>
                <inlineInput
                  :initialValue="item.data.ssh.username"
                  :valid="validation.username"
                  :allowEdit="allowEdit"
                  inputType="text"
                  valueName="username"
                  emptyValue="<em class='text-muted'>(no username)</em>"
                  v-on:changeValue="changeSSHValue"/>
              </td>
            </tr>
            <tr>
              <th class="field-label-right">password : </th>
              <td>
                <inlineInput
                  :initialValue="item.data.ssh.password"
                  :valid="validation.password"
                  :allowEdit="allowEdit"
                  inputType="password"
                  emptyValue="<em class='text-muted'>(no password)</em>"
                  valueName="password"
                  v-on:changeValue="changeSSHValue"/>
              </td>
            </tr>
            <tr>
              <th class="field-label-right">SSH Port : </th>
              <td>
                <inlineInput
                  :initialValue="item.data.ssh.port"
                  :valid="validation.port"
                  :allowEdit="allowEdit"
                  inputType="text"
                  valueName="port"
                  v-on:changeValue="changeSSHValue"/>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button
                  v-bind:disabled="!canTestConnection"
                  v-on:click="testConnection" type="button" class="btn btn-default btn-block">
                    <i v-show="action === 'test-connection'" class="fa fa-refresh fa-spin"></i>
                    <span v-show="connectionOk === true" class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                    <span v-show="connectionOk === false" class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red"></span>

                    &nbsp;Test Connection
                </button>
              </td>
            </tr>
          </tbody>
        </table>

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
