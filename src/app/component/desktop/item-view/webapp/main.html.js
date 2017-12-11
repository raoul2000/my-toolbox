module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">
      {{item.data.ssh.host}}

      <div v-for="tomcat in item.data.tomcat">
        <tomcat
          :ip="item.data.ssh.host"
          :tomcat="tomcat"/>
      </div>

    </div>
  </div>
</div>
`;
