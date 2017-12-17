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
  <td></td>
</tr>
`;
