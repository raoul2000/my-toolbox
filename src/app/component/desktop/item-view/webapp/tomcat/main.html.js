module.exports = `
<div >
  <h2> Tomcat </h2>
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

  <div v-for="webapp in tomcat.webapps">
    <div style="border:1px solid blue">
    <webapp
      :tomcatId="tomcat.id"
      :ip="ip"
      :port="tomcat.port"
      :webappsPath="webappsPath"
      :webapp="webapp"/>
    </div>
  </div>
</div>
`;
