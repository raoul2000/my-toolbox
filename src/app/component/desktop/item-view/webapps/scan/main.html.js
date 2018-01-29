module.exports = `
<div>

    <div v-if="task != null" class="">
      <h2>Scanner</h2>
      <hr/>
      {{task.step}} - {{ task.status}}
      <div v-if="task.step == 'INIT'">
        <p>
          First step is to find installed Apache Tomcat instances.
        </p>
        <i class="fa fa-cog fa-spin fa-fw"></i> searching tomcat instances ...
        <button v-on:click="startSearchTCId()" class="btn btn-primary">Start</button>
      </div>
      <div v-else-if="task.step == 'SCAN_TC_ID'">
        <div v-if="task.status == 'BUSY'">
          <i class="fa fa-cog fa-spin fa-fw"></i> searching tomcat instances ...
        </div>
        <div v-else-if="task.status == 'ERROR'">
          <p>something went wrong ! </p>
          <pre>
            {{task.errorMessage}}
          </pre>
        </div>
        <div v-else-if="task.status == 'SUCCESS'">
          <div
            v-if="task.tomcats.length != 0"
          >
            <p>{{task.tomcats.length}} Tomcat Id(s) could be found on this server. Select the one(s) you want to scan :  </p>
            <div
              v-for="(tomcat, index) in task.tomcats"
              :key="index"
              class="checkbox"
            >
              <label>
                <input
                  type="checkbox"
                  :value="tomcat.id"
                  v-on:click="toggleTomcatSelection(tomcat.id)"
                  :checked="tomcat.selected"
                />
                  Tomcat <b>{{tomcat.id}}</b>
              </label>
            </div>
            
            <hr/>
            <!-- button bar -->
            <button
              v-on:click="scanSelectedTomcats()"
              class="btn btn-primary">Scan Selected</button>
            <button
              class="btn btn-default"
              v-on:click="cancel()">Cancel</button>
            <!-- button bar -->

          </div>
          <div v-else>
            <p>No tomcat Id could be found on this server !</p>
          </div>
        </div>
        <div v-else>
         {{task.status}}
        </div>
      </div>

      <div v-else-if="task.step == 'SCAN_WEBAPP'">
      <div v-if="task.status == 'BUSY'">
        <i class="fa fa-cog fa-spin fa-fw"></i> analyzing Tomcats instances ...
      </div>
      <div v-else-if="task.status == 'ERROR'">
      </div>
      <div v-else-if="task.status == 'SUCCESS'">
      </div>

      </div>


    </div><!-- /.modal-content -->

</div><!-- /.modal -->
`;
