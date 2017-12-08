module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">
      {{item.data.ssh.host}}
      <div v-for="tomcat in item.data.tomcat">
        <tomcat/>
      </div>
      <table class="table table-striped table-hover table-condensed">
        <thead>
          <tr>
            <th>name</th>
            <th>URL</th>
            <th>version</th>
            <th>status</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</div>
`;
