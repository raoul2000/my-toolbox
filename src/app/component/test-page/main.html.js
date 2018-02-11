module.exports = `
<div>
  <table class="table">
    <tr>
      <td>
        <inlineInput2
          :value="values.field1"
          :valid="validation.field1"
          inputType="text"
          valueName="field1"
          emptyValue="<em class='text-muted'>no value</em>"
          v-on:changeValue="changeValue"/>
      </td>
      <td>
        <inlineInput2
          :value="values.field2"
          :valid="validation.field2"
          inputType="text"
          valueName="field2"
          emptyValue="<em class='text-muted'>no value</em>"
          v-on:changeValue="changeValue"/>
      </td>
    </tr>
  </table>
</div>
`;
