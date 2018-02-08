module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">

      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button title="Add Component" v-on:click="addComponent()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Component
        </button>
      </div>
      <div v-if="item.data.components.length !== 0 ">
        <table
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


    </div>
  </div>
</div>
`;
