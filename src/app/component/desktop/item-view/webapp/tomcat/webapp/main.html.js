module.exports = `
<div>
  webapp<br/>
  <hr/>
  <div class="btn-group" role="group" style="margin-bottom:1em;">
    <button title="Delete Webapp" v-on:click="deleteWebapp()" type="button" class="btn btn-default">
      Delete Webapp
    </button>
  </div>
  ID = <inlineInput
    :initialValue="webapp.name"
    :valid="validation.name"
    inputType="text"
    valueName="name"
    v-on:changeValue="changeValue"/>
    <br/>

    Path : <inlineInput
      :initialValue="webapp.path"
      :valid="validation.path"
      inputType="text"
      valueName="path"
      v-on:changeValue="changeValue"/>
      <br/>
      <a :href="webappURL">{{webappURL}}</a>

</div>
`;
