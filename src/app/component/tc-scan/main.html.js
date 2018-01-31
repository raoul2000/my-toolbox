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
                <td class="field-label-right">Name</td>
                <td>
                  <b>{{item.name}}</b>
                </td>
              </tr>
              <tr>
                <td class="field-label-right">Catégorie</td>
                <td>{{ item.path.join(' / ')}}</td>
              </tr>
              <tr>
                <td class="field-label-right">host</td>
                <td>{{item.data.ssh.hostname}}</td>
              </tr>
              <tr>
                <td class="field-label-right">username</td>
                <td>{{item.data.ssh.username}}</td>
              </tr>
              <tr>
                <td class="field-label-right">Tomcat</td>
                <td>{{item.data.tomcats.length}}</td>
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
            <scan-webapp :item="item" :taskId="taskId"
            v-on:tc-scan-success="onTcScanSuccess"/>
          </div>
          <div v-else-if="task.step == 'IMPORT_RESULT'">
            <import-result :item="item" :taskId="taskId" />
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
