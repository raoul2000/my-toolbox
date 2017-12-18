module.exports = `
<tr>
  <td>
    <inlineInput
      :initialValue="component.name"
      :valid="validation.name"
      inputType="text"
      valueName="name"
      emptyValue="<em class='text-muted'>Enter component name ...</em>"
      v-on:changeValue="changeValue"/>
  </td>
  <td></td>
  <td></td>
  <td>
    <button title="Delete this component" v-on:click="deleteComponent()" type="button" class="btn btn-danger btn-xs">
      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </button>
  </td>
</tr>
`;
