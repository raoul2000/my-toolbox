module.exports = `
<div>

  <div class="row">
    <div v-if="data != null " class="col-lg-12">
      <table class="table table-hover">
        <tbody>
          <tr>
            <th>host</th>
            <td>{{data.ssh.host}}</td>
          </tr>
          <tr>
            <th>username</th>
            <td>{{data.ssh.username}}</td>
          </tr>
          <tr>
            <th>password</th>
            <td>
              <span v-if="data.ssh.password.length != 0">
              ********
              </span>
              <span v-else>
                <em><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> no password</em>
              </span>
            </td>
          </tr>
          <tr>
            <th>SSH Port</th>
            <td>{{data.ssh.port}}</td>
          </tr>          
          <tr>
            <th>notes</th>
            <td><div class="well">{{data.notes}}</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
`;
