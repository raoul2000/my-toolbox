module.exports = `
<div id="webapps-panel" v-if="item != null ">

  <div class="row">
    <div v-if="view.childViewId == 'TOMCAT_LIST'" class="col-lg-12">

      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button title="Add Tomcat" v-on:click="addTomcat()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Tomcat
        </button>
        <button title="Scan Server for Tomcat instances ..." v-on:click="openScannerView()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-record" aria-hidden="true"></span> Scan ...
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
            aria-hidden="true"></span> Tomcat
        </button>
        <button
          title="Expand/collapse Webapp Details"
          v-on:click="toggleWebappView()"
          type="button" class="btn btn-default btn-xs"
        >
          <span
            v-bind:class="viewWebappClass()"
            class="glyphicon glyphicon-eye-open"
            aria-hidden="true"></span> Webapp
        </button>

        <button
          title="update Tomcat version"
          v-on:click="updateAllTomcatVersion()"
          type="button" class="btn btn-default btn-xs"
        >
          <span
            class="glyphicon glyphicon-refresh"
            aria-hidden="true"></span>
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
            :expandTomcat="view.expandTomcat"
            :expandWebapp="view.expandWebapp"
            :filter="filterText"
            :tomcat="tomcat"/>
        </div>
      </div>
      <div v-else>
        <div class="row">
          <div class="col-md-6 col-md-offset-3">
            <div class="alert alert-info" role="alert">
              <p>
                <b>No tomcat</b> on this server.<br/>
                You can add Tomcat manually, or try your luck with the scanner stuff ...
              </p>
            </div>
          </div>
        </div>

      </div>

    </div><!-- col-lg-12 -->

    <div v-if="view.childViewId == 'SCANNER'" class="col-lg-12">
      <modal-tc-scan
        :item="item"
        v-on:close="closeScannerView()"></modal-tc-scan>
    </div><!-- col-lg-12 -->

  </div>
</div>
`;
