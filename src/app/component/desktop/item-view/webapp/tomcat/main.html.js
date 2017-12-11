module.exports = `
<div>
  ip = {{ip}}
  tomcat id = {{tomcat.id}}
  Port =  {{tomcat.port}}
  <div v-for="aWebapp in tomcat.webapp">

    <webapp
      :tomcatId="tomcat.id"
      :ip="ip"
      :port="tomcat.port"
      :webapp="aWebapp"/>
  </div>
</div>
`;
