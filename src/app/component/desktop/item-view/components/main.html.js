module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">

      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button title="Add Component" v-on:click="addComponent()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Component
        </button>
      </div>

      <table
        v-if="item.data.components.length != 0"
        class="table table-striped table-hover table-condensed">
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr is="componentRow"
            v-for="component in item.data.components"
            v-bind:item="item"
            v-bind:component="component"
            v-bind:key="component._id">
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</div>
`;
