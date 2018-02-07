module.exports = `
<div>
  <h3>Scan For Web Applications</h3>
  <div v-if="task.tomcats.length != 0">
    <p>
      I have detected {{ task.tomcats.length}} possible Tomcat instance(s) on this server :
      select the one(s) you want to scan and press "<em>Start</em>" to proceed :
    </p>

    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>
            Apache Tomcat Identifier(s)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
          <span
            class="glyphicon glyphicon-ok" aria-hidden="true" style="    visibility: hidden;"></span>
          </td>
          <td>
          <button
            v-on:click="selectAll(true)"
            type="button" class="btn btn-default btn-xs">Select All</button>
          <button
            v-on:click="selectAll(false)"
            type="button" class="btn btn-default btn-xs">Deselect All</button>

          <em>(current selection : {{selectedCount}}) </em>
          </td>
        </tr>
        <tr
          v-for="(tomcat, index) in task.tomcats"
          :key="index"
          v-on:click="toggleTomcatSelection(tomcat)"
          style="cursor:pointer"
          v-bind:class="{ 'selected-tcid' : tomcat.selected }"
          >
          <td>
            <span
              v-if="tomcat.selected"
              class="glyphicon glyphicon-ok" aria-hidden="true"></span>
          </td>
          <td width="100%">
            {{tomcat.id}}
          </td>
        </tr>
      </tbody>
    </table>


    <button v-on:click="start()" class="btn btn-primary"
      :disabled="task.status == 'BUSY'">
      <span v-if="task.status == 'IDLE'">
        Start Web Aplication Scan
      </span>
      <span v-else-if="task.status == 'BUSY'">
        <i class="fa fa-cog fa-spin fa-fw"></i> Web Application Scan in progress ...
      </span>
    </button>
  </div>

  <div v-else>
    <p>
      Oups ! .. it seems that I have not been able to find any tomcat instance on this server.
    </p>
  </div>
</div>
`;
