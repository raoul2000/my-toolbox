module.exports = `
<div class="row">
  <div class="col-lg-12">

  <h2>Download</h2>
  <hr/>

  <!-- toolbar -->
  <div class="toolbar-container" style="margin-bottom:1em;">

    <div class="btn-group" role="group" >
      <button v-on:click="refresh()" type="button" class="btn btn-default">
        <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
      </button>
    </div>

  </div>
  <!-- end toolbar -->


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
