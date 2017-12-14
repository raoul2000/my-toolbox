module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">

      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button title="Add Tomcat" v-on:click="AddTomcat()" type="button" class="btn btn-default">
          Add tomcat
        </button>
      </div>

      {{item.data.ssh.host}}

      <div v-for="tomcat in item.data.tomcat"  :key="tomcat.id">
        <div style="border:4px solid #eee">
        <tomcat
          :ip="item.data.ssh.host"
          :tomcatIds="tomcatIds"
          :item="item"
          :tomcat="tomcat"/>
        </div>
      </div>

    </div>
  </div>
</div>
`;
