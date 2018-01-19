module.exports = `
<div class="servlet-container">

  <table class="info-servlet">
    <tr>
      <td class="field-label-right" width="200px">
        <inlineInput2
          :value="servlet.name"
          :valid="validation.name"
          inputType="text"
          valueName="name"
          emptyValue="<em class='text-muted'>servlet name</em>"
          v-on:changeValue="changeValue"/>
      </td>
      <td width="50%">
        <inlineInput2
          :value="servlet.urlPattern"
          :valid="validation.urlPattern"
          inputType="text"
          valueName="urlPattern"
          emptyValue="<em class='text-muted'>URL pattern</em>"
          v-on:changeValue="changeValue"/>
      </td>
    </tr>
  </table>
</div>
`;
