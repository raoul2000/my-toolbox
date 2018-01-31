module.exports = `
<div class="row">
  <div class="col-lg-12">
    <h1>Web Application Scanner</h1>
    <hr/>
    <div class="alert alert-warning" role="alert">
      <p>
        This is an <b>experimental</b> feature that scans the target server
        and build a list of Tomcat instances with the web applications they contains.
      </p>
    </div>


    <div class="row">
      <div class="col-xs-3">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
              Target Server
            </h3>
          </div>

          <table class="table">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{{item.name}}</td>
              </tr>
              <tr>
                <td>host</td>
                <td>{{item.data.ssh.hostname}}</td>
              </tr>
              <tr>
                <td>username</td>
                <td>{{item.data.ssh.username}}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div> <!-- // col-xs-3 -->
      <div class="col-xs-9">
        <div class="tcscan-steps" style="margin-left:3em;">
          <div v-if="task.step == 'SCAN_TC_ID'">
            <tcid-list :item="item" :taskId="taskId"
              v-on:tcid-list-success="onTcIdListSuccess"/>
          </div>
          <div v-else-if="task.step == 'SCAN_WEBAPP'">
            <scan-webapp :item="item" :taskId="taskId" />
          </div>
        </div>
        <hr/>
        <button
          class="btn btn-default"
          v-on:click="cancel()">Cancel</button>
      </div><!-- // col-xs-9 -->
      {{task.step}} - {{ task.status}}
    </div><!-- // row -->



  </div>
</div>
`;
