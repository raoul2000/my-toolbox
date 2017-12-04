module.exports = `
<div>

  <div class="row">
    <div v-if="data != null " class="col-lg-12">
      <table class="table table-hover">
        <tbody>
          <tr>
            <th width="200px">host</th>
            <td data-field="host">
              <inlineInput
                :initialValue="data.ssh.host"
                :valid="validation.host"
                inputType="text"
                valueName="host"
                v-on:changeValue="changeSSHValue"/>
            </td>
          </tr>
          <tr>
            <th>username</th>
            <td>
            <inlineInput
              :initialValue="data.ssh.username"
              :valid="validation.username"
              inputType="text"
              valueName="username"
              v-on:changeValue="changeSSHValue"/>

            </td>
          </tr>
          <tr>
            <th>password</th>
            <td>
            <inlineInput
              :initialValue="data.ssh.password"
              :valid="validation.password"
              inputType="password"
              valueName="password"
              v-on:changeValue="changeSSHValue"/>
            </td>
          </tr>
          <tr>
            <th>SSH Port</th>
            <td>
              <inlineInput
                :initialValue="data.ssh.port"
                :valid="validation.port"
                inputType="text"
                valueName="port"
                v-on:changeValue="changeSSHValue"/>
            </td>
          </tr>
          <tr>
            <th>notes</th>
            <td>
              <inlineInput
                :initialValue="data.notes"
                :valid="validation.notes"
                inputType="textarea"
                valueName="notes"
                v-on:changeValue="changeNotesValue"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
`;
