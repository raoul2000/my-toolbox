module.exports = `
<div>
  <h3>Scan For Web Applications</h3>
  <p>
    I have found {{ task.tomcats.length}} Tomcat instance(s) on this server.
    Please select the ones you want to scan and press "Start" to proceed :
  </p>

  <div
    v-for="(tomcat, index) in task.tomcats"
    :key="index">

    <label>
      <input
        type="checkbox"
        :value="tomcat.id"
        v-on:click="toggleTomcatSelection(tomcat.id)"
        :disabled="task.status == 'BUSY'"
        :checked="tomcat.selected"/>

        Tomcat <b>{{tomcat.id}}</b>
    </label>
  </div>
  <button v-on:click="start()" class="btn btn-primary"
    :disabled="task.status == 'BUSY'">
    <span v-if="task.status == 'IDLE'">
      Start
    </span>
    <span v-else-if="task.status == 'BUSY'">
      <i class="fa fa-cog fa-spin fa-fw"></i> scanning ...
    </span>
  </button>
</div>
`;
