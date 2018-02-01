module.exports = `
<div>
  <h3>Import Result</h3>
  <table  class="table">
    <tbody>
      <template
        v-for="tomcat in task.result.tomcats"
        :id="tomcat._id">
        <tr style="background-color: #faf9ff;    border-top: 8px #f3f3f3 solid;">
          <td><h4>{{tomcat.id}}</h4></td>
          <td colspan="2">
            <ul>
              <li>port : {{tomcat.port}}</li>
              <li>Install Path : <b>{{tomcat.installFolderPath}}</b></li>
              <li>Webapp count : {{tomcat.webapps.length}}</li>
            </ul>
          </td>
        </tr>
        <template
          v-for="webapp in tomcat.webapps"
          :id="tomcat._id"
        >
          <tr>
            <td></td>
            <td>
              <h5>{{webapp.name}}</h5>
            </td>
            <td style="font-size: 0.85em;">
              <ul>
                <li>Context Path : {{webapp.contextPath}}</li>
                <li>Descriptor Path : {{webapp.descriptorFilePath}}</li>
                <li>Reference : {{webapp.refId}}</li>
              </ul>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>

  <p>
    First step is to find installed Apache Tomcat instances.
  </p>
</div>
`;
