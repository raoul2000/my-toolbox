module.exports = `
<div>
  <h3>Find Installed Tomcat Instances</h3>
  <p>
    First step is to find installed Apache Tomcat instances.
  </p>
  {{task.status}}
  <button v-on:click="startSearchTCId()" class="btn btn-primary"
    :disabled="task.status == 'BUSY'">
    <span v-if="task.status == 'IDLE'">
      Start
    </span>
    <span v-else-if="task.status == 'BUSY'">
      <i class="fa fa-cog fa-spin fa-fw"></i> searching tomcat instances ...
    </span>
  </button>
</div>
`;
