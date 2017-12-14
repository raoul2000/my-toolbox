module.exports = `
<div>
  webapp<br/>
  <hr/>

  ID = <inlineInput
    :initialValue="webapp.name"
    :valid="validation.name"
    inputType="text"
    valueName="webapp-name"
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
