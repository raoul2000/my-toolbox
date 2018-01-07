module.exports = `
<div id="webapps-panel" v-if="item != null ">
  <div class="row">

    <div v-if="openScanModal">
      <modal-tc-scan
        :item="item"
        v-on:close="openScanModal = false"></modal-tc-scan>
    </div>

    <div class="col-lg-12">

      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button title="Add Tomcat" v-on:click="addTomcat()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Tomcat
        </button>
        <button title="Scan Tomcat" v-on:click="openScanModal = true" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Scan Tomcat
        </button>
      </div>


      <div
        v-if="item.data.tomcats.length !== 0"
        class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button
          title="Expand/collapse Tomcat Details"
          v-on:click="toggleTomcatView()"
          type="button" class="btn btn-default btn-xs"
        >
          <span
            v-bind:class="viewTomcatClass()"
            aria-hidden="true"></span> s/h Tomcat
        </button>
        <button
          title="Expand/collapse Webapp Details"
          v-on:click="toggleWebappView()"
          type="button" class="btn btn-default btn-xs"
        >
          <span
            v-bind:class="viewWebappClass()"
            class="glyphicon glyphicon-eye-open"
            aria-hidden="true"></span> s/h Webapp
        </button>
      </div><!-- end toolbar expand/collapse -->

      <input
        v-if="item.data.tomcats.length !== 0"
        class="webapp-filter"
        v-model="filterText" type="text" placeholder="enter filter ..."/>

      <div v-if="item.data.tomcats.length !== 0 ">
        <div
          class="tomcat-container"
          v-for="tomcat in item.data.tomcats"
          :key="tomcat._id"
          :id="tomcat._id">
          <tomcat
            :item="item"
            :expandTomcat="expandTomcat"
            :expandWebapp="expandWebapp"
            :filter="filterText"
            :tomcat="tomcat"/>
        </div>
      </div>
      <div v-else>
        <h1>No Tomcat</h1>
      </div>

    </div><!-- col-lg-12 -->
  </div>
</div>
`;
