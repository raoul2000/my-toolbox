module.exports = `
<div>
  ID = <inlineInput
    :initialValue="tomcat.id"
    :valid="validation.id"

    inputType="text"
    valueName="tomcat-id"
    v-on:changeValue="changeValue"/>
    <br/>

    Port : <inlineInput
      :initialValue="tomcat.port"
      :valid="validation.port"
      inputType="text"
      valueName="tomcat-port"
      v-on:changeValue="changeValue"/>
      <br/>

  <div v-for="aWebapp in tomcat.webapp">

    <webapp
      :tomcatId="tomcat.id"
      :ip="ip"
      :port="tomcat.port"
      :webappsPath="webappsPath"
      :webapp="aWebapp"/>
  </div>
</div>
`;
