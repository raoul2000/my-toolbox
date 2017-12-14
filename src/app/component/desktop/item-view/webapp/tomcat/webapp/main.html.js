module.exports = `
<div>
  webapp<br/>
  <hr/>

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
