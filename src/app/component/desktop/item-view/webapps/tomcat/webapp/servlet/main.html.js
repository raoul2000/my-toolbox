module.exports = `
<tr>
  <td></td>
  <td>
    <inlineInput2
      :value="servlet.name"
      :valid="validation.name"
      :allowEdit="!isReadOnly"
      inputType="text"
      valueName="name"
      emptyValue="<em class='text-muted'>servlet name</em>"
      v-on:changeValue="changeValue"/>
  </td>
  <td>
    <inlineInput2
      :value="servlet.class"
      :valid="validation.class"
      :allowEdit="!isReadOnly"
      inputType="text"
      valueName="class"
      emptyValue=""
      v-on:changeValue="changeValue"/>
  </td>
  <td>
    <inlineInput2
      :value="displayUrlPatterns"
      :valid="validation.urlPatterns"
      :allowEdit="!isReadOnly"
      inputType="text"
      valueName="urlPatterns"
      emptyValue=""
      v-on:changeValue="changeValue"/>
  </td>
  <td class="tc-actions">
    <span
      v-on:click="openServletURL"
      :title="btTitleOpenServletURL"
      class="glyphicon glyphicon-link" aria-hidden="true"/>
    <span
      v-if="!isReadOnly"
      v-on:click="deleteServlet()"
      title="delete"
      class="glyphicon glyphicon-remove" aria-hidden="true"/>
  </td>

</tr>
`;
