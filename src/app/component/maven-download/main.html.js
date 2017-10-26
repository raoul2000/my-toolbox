module.exports = `
<div class="row">
  <div class="col-lg-12">

  <h2>Download</h2>
  <hr/>
  <table
    v-if="modules.length != 0"
    class="table table-striped table-hover table-condensed">
    <thead>
      <tr>
        <th></th>
        <th>id</th>
        <th>Name</th>
        <th>version</th>
        <th>file</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr is="module-row"
        v-for="module in modules"
        v-bind:module="module"
        v-bind:key="module.id">
      </tr>
    </tbody>
  </table>


  </div><!-- // col-lg-12 -->
</div><!-- // row -->



`;
