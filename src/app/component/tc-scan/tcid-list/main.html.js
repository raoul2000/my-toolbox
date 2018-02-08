module.exports = `
<div>
  <h3>Find Installed Tomcat Instances</h3>
  <div v-if="hasValidSSHCredentials">
    <p>
      First step is to find installed Apache Tomcat instances.
    </p>
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
  <div v-else>
    <div class="alert alert-danger" role="alert">
      <b>Missing SSH connection info</b><br/>
      I need an SSH connection to proceed, and it seems that you didn't provide one of :
      <ul>
        <li>host</li>
        <li>username</li>
        <li>password</li>
        <li>port</li>
      </ul>
      Update the SSH connection settings for this server and try again.
    </div>
  </div>
</div>
`;
