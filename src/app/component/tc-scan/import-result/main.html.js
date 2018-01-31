module.exports = `
<div>
  <h3>Import Result</h3>
  <table
    v-for="tomcat in task.result.tomcats"
    :key="tomcat._id"
    :id="tomcat._id"
    class="table">
    <tbody>
      <tr>
        <td>{{tomcat.id}}</td>
        <td>
          port : {{tomcat.port}}<br/>
          Install Path : {{tomcat.installFolderPath}}<br/>
          Webapp count : {{tomcat.webapps.length}}<br/>
          <table>
            <tr
              v-for="webapp in tomcat.webapps"
              :key="tomcat._id"
              :id="tomcat._id"
              >
                <td>
                  {{webapp.name}}
                </td>
                <td>
                  <ul>
                    <li>Context Path : {{webapp.contextPath}}</li>
                    <li>Descriptor Path : {{webapp.descriptorFilePath}}</li>
                    <li>Reference : {{webapp.refid}}</li>
                  </ul>
                </td>
            </tr>
          </table>

        </td>
      </tr>
    </tbody>
  </table>

  <p>
    First step is to find installed Apache Tomcat instances.
  </p>
</div>
`;
