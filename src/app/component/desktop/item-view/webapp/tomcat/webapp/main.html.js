module.exports = `
<div>
  webapp<br/>
  <hr/>
  <div role="group" class="btn-group btn-group-sm secondary-toolbar">
    <button title="Delete Webapp" v-on:click="deleteWebapp()" type="button" class="btn btn-danger">
      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
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
