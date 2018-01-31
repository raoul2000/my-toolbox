module.exports = `
<div>
  <h3>Import Result</h3>
  <table
    v-for="tomcat in task.tomcats"
    :key="tomcat.id"
    :id="tomcat.id">
    <tbody>
      <tr>
        <td>{{tomcat.name}}</td>
      </tr>
    </tbody>
  </table>

  <p>
    First step is to find installed Apache Tomcat instances.
  </p>
</div>
`;
