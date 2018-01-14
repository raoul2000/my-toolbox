module.exports = `
<div>

    <div v-if="task != null" class="">
      <h2>Scanner</h2>
      <hr/>
      {{task.step}} - {{ task.status}}
      <div v-if="task.step == 'INIT'">
        <p>
          search for installed Apache Tomcat instances
        </p>
        <button v-on:click="startSearchTCId()">Start</button>
      </div>
      <div v-else-if="task.step == 'SCAN_TC_ID'">
        <div v-if="task.status == 'BUSY'">
          scanning tomcat Ids ...
        </div>
        <div v-else-if="task.status == 'ERROR'">
          <p>something went wrong ! </p>
          <pre>
            {{task.errorMessage}}
          </pre>
        </div>
        <div v-else-if="task.status == 'SUCCESS'">
          <p>Ids extracted <em>({{tomcatSelectedCount}})</em> selected: </p>
          <table class="table">
            <tr v-for="(tomcat, index) in task.tomcats" :key="index">
              <td>
                <input
                  type="checkbox"
                  :value="tomcat.id"
                  v-on:click="toggleTomcatSelection(tomcat.id)"
                  :checked="tomcat.selected">
              </td>
              <td width="100%">
                 {{tomcat.id}}
              </td>
              <td></td>
            </tr>
          </table>
          <button
            v-on:click="scanSelectedTomcats()">Scan Selected</button>
        </div>
        <div v-else>
         {{task.status}}
        </div>
      </div>

      <div v-else-if="task.step == 'SCAN_WEBAPP'">
        <p v-if="task.status == 'BUSY'">scan in progress...</p>
        <div v-else>
          <table class="table">
            <tr v-for="(tomcat, index) in task.tomcats" :key="index">
              <td>
                <input
                  type="checkbox"
                  :value="tomcat.id"
                  v-on:click="toggleTomcatSelection(tomcat.id)"
                  :checked="tomcat.selected">
              </td>
              <td width="100%">
                 {{tomcat.id}}
              </td>
              <td>
              </td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>

      <hr/>
      <button v-on:click="cancel()">Cancel</button>
    </div><!-- /.modal-content -->

</div><!-- /.modal -->
`;
