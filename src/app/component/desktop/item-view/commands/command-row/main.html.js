module.exports = `
<tr>
  <td>
    <inlineInput
      :initialValue="command.name"
      :valid="validation.name"
      inputType="text"
      valueName="name"
      emptyValue="<em class='text-muted'>Enter command name ...</em>"
      v-on:changeValue="changeValue"/>
  </td>
  <td>
    <inlineInput
      :initialValue="command.source"
      :valid="validation.source"
      inputType="text"
      valueName="source"
      emptyValue="<em class='text-muted'>Enter your command ...</em>"
      v-on:changeValue="changeValue"/>
  </td>
  <td></td>

  <td class="tc-actions">

    <span
      v-if="! runCmdTask || runCmdTask.status != 'BUSY'"
      v-on:click="runCommand"
      title="run command"
      class="glyphicon glyphicon-refresh update-version-button" aria-hidden="true"/>
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
