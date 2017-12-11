module.exports = `
<div>
  webapp<br/>
  <hr/>

  ID = <inlineInput
    :initialValue="webapp.id"
    :valid="validation.id"
    inputType="text"
    valueName="webapp-id"
    v-on:changeValue="changeValue"/>
    <br/>

    Path : <inlineInput
      :initialValue="webapp.path"
      :valid="validation.path"
      inputType="text"
      valueName="webapp-path"
      v-on:changeValue="changeValue"/>
      <br/>
      <a :href="webappURL">{{webappURL}}</a>

</div>
`;
