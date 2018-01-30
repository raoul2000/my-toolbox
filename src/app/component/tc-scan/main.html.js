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

    {{task.step}} - {{ task.status}}

    <div v-if="task.step == 'SCAN_TC_ID'">
      <tcid-list :item="item" :taskId="taskId"
      v-on:tcid-list-success="onTcIdListSuccess"/>
    </div>
    <div v-else-if="task.step == 'SCAN_WEBAPP'">
      <scan-webapp :item="item" :taskId="taskId" />
    </div>
    <hr/>
    <button
      class="btn btn-default"
      v-on:click="cancel()">Cancel</button>

  </div>
</div>
`;
