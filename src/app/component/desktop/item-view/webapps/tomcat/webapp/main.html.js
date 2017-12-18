module.exports = `
<div class="webapp-container">

  <table class="header-webapp">
    <tr>
    <td class="header-webapp-text" width="100%">
      <inlineInput
        :initialValue="webapp.name"
        :valid="validation.name"
        inputType="text"
        emptyValue="<em class='text-muted'>ENTER WEBAPP NAME HERE ...</em>"
        valueName="name"
        v-on:changeValue="changeValue"/>
    </td>
    <td style="white-space:nowrap;text-align:center; padding-right:10px;">
      <a :href="webappURL" :title="webappURL">open</a>
    </td>
    <td>
      <button title="Delete this Webapp" v-on:click="deleteWebapp()" type="button" class="btn btn-danger btn-xs">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </button>
    </td>
    </tr>
  </table>

  <table>
    <tr>
      <td class="field-label-right">
        path : 
      </td>
      <td width="100%">
        <inlineInput
          :initialValue="webapp.path"
          :valid="validation.path"
          inputType="text"
          valueName="path"
          emptyValue="<em class='text-muted'>home page path</em>"
          v-on:changeValue="changeValue"/>
      </td>
    </tr>
  </table>
</div>
`;