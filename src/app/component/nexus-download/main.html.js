module.exports = `
<div class="row">
  <div class="col-lg-12">

  <h2>Download</h2>
  <hr/>

  <div v-if="modules.length !== 0"
    class="input-group input-group-sm nexus-module-filter">
    <span class="input-group-addon" id="sizing-addon3">
    <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>
    </span>
    <input
      class="form-control"
      v-model="filterText" type="text" placeholder="enter filter ..."/>
  </div>



  <table
    v-if="filteredModules.length != 0"
    class="table table-striped table-hover table-condensed nexus-module-list">
    <thead>
      <tr>
        <th></th>
        <th></th>
        <th>version</th>
        <th>file</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr is="module-row"
        v-for="module in filteredModules"
        v-bind:module="module"
        v-bind:key="module.id">
      </tr>
    </tbody>
  </table>
  <div v-else>
    <div class="alert alert-info" role="alert">No module available</div>
  </div>


  </div><!-- // col-lg-12 -->
</div><!-- // row -->
`;
