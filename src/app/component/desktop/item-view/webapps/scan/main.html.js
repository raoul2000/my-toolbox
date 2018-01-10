module.exports = `
<div >

    <div v-if="task != null" class="">
      <h2>Scanner</h2>
      <hr/>
      {{task.step}} - {{ task.status}}
      <div v-if="step == 'INIT'">
        <p>
          search for installed Apache Tomcat instances
        </p>
        <button v-on:click="startSearchTCId()">Start</button>
      </div>
      <div v-else-if="step == 'SCAN_TC_ID'">
        <div v-if="status == 'BUSY'">
          scanning tomcat Ids ...
        </div>
        <div v-else-if="status == 'ERROR'">
          <p>something went wrong ! </p>
          <pre>
            {{task.error.message}}
          </pre>
        </div>
        <div v-else-if="status == 'SUCCESS'">
          <p>Ids extracted : </p>
        </div>
      </div>
      <div v-else-if="step == 'SCAN_WEBAPP'">
      </div>
      <hr/>
      <button v-on:click="cancel()">Cancel</button>
    </div><!-- /.modal-content -->

</div><!-- /.modal -->
`;
