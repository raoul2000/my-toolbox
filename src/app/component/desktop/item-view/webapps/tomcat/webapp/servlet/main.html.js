module.exports = `
<tr>
  <td></td>
  <td>
    <inlineInput2
      :value="servlet.name"
      :valid="validation.name"
      inputType="text"
      valueName="name"
      emptyValue="<em class='text-muted'>servlet name</em>"
      v-on:changeValue="changeValue"/>
  </td>
  <td>
    <inlineInput2
      :value="servlet.class"
      :valid="validation.class"
      inputType="text"
      valueName="class"
      emptyValue=""
      v-on:changeValue="changeValue"/>
  </td>
  <td>
    <inlineInput2
      :value="displayUrlPatterns"
      :valid="validation.urlPatterns"
      inputType="text"
      valueName="urlPatterns"
      emptyValue=""
      v-on:changeValue="changeValue"/>
  </td>
  <td>
    <a :href="servletURL" :title="servletURL">open</a>
    <span
      title="Delete this Servlet" v-on:click="deleteServlet()"
      style="cursor:pointer; color:#fba8a8;"
      class="glyphicon glyphicon-remove" aria-hidden="true"></span>
  </td>
</tr>
`;
