module.exports = `
<tr>
  <td  style="white-space:nowrap;padding-right:2em;">
    <inlineInput
      :initialValue="command.name"
      :valid="validation.name"
      inputType="text"
      valueName="name"
      emptyValue="<em class='text-muted'>Enter command name ...</em>"
      v-on:changeValue="changeValue"/>
  </td>
  <td width="100%">
    <inlineInput
      :initialValue="command.source"
      :valid="validation.source"
      inputType="text"
      valueName="source"
      emptyValue="<em class='text-muted'>Enter your command ...</em>"
      v-on:changeValue="changeValue"/>
      <br/>
      result
      <div v-if="cmdResult && cmdResult.code === 0">
        <pre>{{cmdResult.stdout}}</pre>
      </div>
  </td>
  <td>
    <span
      v-if="cmdResult && cmdResult.code === 0 && cmdResult.stdout.length !== 0"
      title="show output"
      class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
  </td>

  <td class="tc-actions">

    <span
      v-if="cmdResult && cmdResult.code === 0"
      :title="success"
      class="glyphicon glyphicon-ok text-success" aria-hidden="true"></span>
    <span
      v-else-if="cmdResult && cmdResult.code !== 0"
      :title="cmdResult.stderr"
      class="glyphicon glyphicon-remove text-error" aria-hidden="true"></span>

    <span
      v-if="! runCmdTask || runCmdTask.status != 'BUSY'"
      v-on:click="runCommand"
      title="run command"
      class="glyphicon glyphicon-play update-version-button" aria-hidden="true"/>
    <span
      v-else
      title="command in progress ..."
      class="glyphicon glyphicon-refresh glyphicon-refresh-animate"
      aria-hidden="true" />

    <span
      v-on:click="deleteCommand()"
      title="delete"
      class="glyphicon glyphicon-remove" aria-hidden="true"/>

  </td>

</tr>
`;
