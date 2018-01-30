module.exports = `
<div>
  <h2>Find Installed Tomcat Instances</h2>
  <p>
    First step is to find installed Apache Tomcat instances.
  </p>
  {{task.status}}
  <button v-on:click="startSearchTCId()" class="btn btn-primary">
    <span v-if="task.status == 'IDLE'">
      Start
    </span>
    <span v-else-if="task.status == 'BUSY'">
      <i class="fa fa-cog fa-spin fa-fw"></i> searching tomcat instances ...
    </span>
  </button>
</div>
`;
