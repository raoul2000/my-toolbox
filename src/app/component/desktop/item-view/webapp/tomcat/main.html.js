module.exports = `
<div >
  <h2> Tomcat </h2>
  <hr/>
  <div class="btn-group" role="group" style="margin-bottom:1em;">
    <button title="Add Webapp" v-on:click="addWebapp()" type="button" class="btn btn-default">
      Add Webapp
    </button>
    <button title="Delete Tomcat" v-on:click="deleteTomcat()" type="button" class="btn btn-default">
      Delete Tomcat
    </button>
  </div>

  ID = <inlineInput
    :initialValue="tomcat.id"
    :valid="validation.id"
    inputType="text"
    valueName="id"
    v-on:changeValue="changeValue"/>
    <br/>

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
