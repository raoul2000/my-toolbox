module.exports = `
<tr class="cmd-row" v-bind:style="{ borderLeftColor : borderColor }">
  <td  width="15%" style="white-space:nowrap;padding-right:2em;">
      <div>
        <inlineInput
          :initialValue="command.name"
          :valid="validation.name"
          inputType="text"
          valueName="name"
          emptyValue="<em class='text-muted'>Enter command name ...</em>"
          v-on:changeValue="changeValue"/>
      </div>
      <div class="toolbar-1">
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
          title="delete this command"
          class="glyphicon glyphicon-remove" aria-hidden="true"/>      
        <span
          v-on:click="viewCommand = ! viewCommand"
          title="view/edit this command"
          class="glyphicon glyphicon-eye-open" aria-hidden="true"/>            
      </div>
  </td>
  <td>
    <div v-if="viewCommand" style="font-family: monospace;">
      <inlineInput
        :initialValue="command.source"
        :valid="validation.source"
        inputType="text"
        valueName="source"
        emptyValue="<em class='text-muted'>Enter your command ...</em>"
        v-on:changeValue="changeValue"/>
    </div>

    <div v-if="cmdResult">
      <pre>{{cmdResult.stdout || cmdResult.stderr }}</pre>
    </div>
  </td>
</tr>
`;
