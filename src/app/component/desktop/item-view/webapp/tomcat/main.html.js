module.exports = `
<div >
  <table class="header-tomcat">
    <tr>
    <td class="header-tomcat-text">Tomcat</td>
    <td class="header-tomcat-text" width="100%">
      <inlineInput
        :initialValue="tomcat.id"
        :valid="validation.id"
        inputType="text"
        valueName="id"
        v-on:changeValue="changeValue"/>
    </td>
    <td>

      <button title="Delete Tomcat" v-on:click="deleteTomcat()" type="button" class="btn btn-danger btn-xs">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </button>
    </td>
    </tr>
  </table>

  <div class="btn-group btn-group-sm secondary-toolbar" role="group">
    <button title="Add Webapp" v-on:click="addWebapp()" type="button" class="btn btn-default btn-xs">
      <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> webapp
    </button>
  </div>

    Port : <inlineInput
      :initialValue="tomcat.port"
      :valid="validation.port"
      inputType="text"
      valueName="port"
      v-on:changeValue="changeValue"/>
      <br/>




  <div v-for="webapp in tomcat.webapps" :key="webapp._id">
    <div style="border:1px solid blue;padding:1em;">
    <webapp
      :item="item"
      :tomcat="tomcat"
      :webapp="webapp"/>
    </div>
  </div>
</div>
`;
