module.exports = `
<div id="webapps-panel" v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">

      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button title="Add Tomcat" v-on:click="addTomcat()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Tomcat
        </button>
        <button title="Toggle Tomcat View" v-on:click="toggleTomcatView()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Tomcat view
        </button>
        <button title="Toggle Webapp View" v-on:click="toggleWebappView()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Webapp view
        </button>
      </div>

      <div
        class="tomcat-container"
        v-for="tomcat in item.data.tomcats"
        :key="tomcat._id"
        :id="tomcat._id">
        <tomcat
          :item="item"
          :expanded="!collapseTomcatView"
          :tomcat="tomcat"/>
      </div>

    </div>
  </div>
</div>
`;
