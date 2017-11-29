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
                :validation="validateIP"
                valueName="host"
                v-on:changeValue="changeValue"/>
              <span
                v-show="!isEditing('host')"
                v-on:click="startEdit">
                {{data.ssh.host}}
              </span>
              <input
                v-show="isEditing('host')"
                v-on:blur="stopEdit"
                type="text"/>
            </td>
          </tr>
          <tr>
            <th>username</th>
            <td>{{data.ssh.username}}</td>
          </tr>
          <tr>
            <th>password</th>
            <td>
              <span v-if="data.ssh.password.length != 0">
              ********
              </span>
              <span v-else>
                <em><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> no password</em>
              </span>
            </td>
          </tr>
          <tr>
            <th>SSH Port</th>
            <td>{{data.ssh.port}}</td>
          </tr>
          <tr>
            <th>notes</th>
            <td><div class="well">{{data.notes}}</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
`;
