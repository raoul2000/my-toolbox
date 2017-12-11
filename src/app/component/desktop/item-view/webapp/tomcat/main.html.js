module.exports = `
<div>
  tomcat id = {{tc.id}}
  <div v-for="webapp in tc.webapp">
    <webapp
      :webapp="webapp"/>
  </div>
</div>
`;
