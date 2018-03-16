module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">

      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button title="Add Command" v-on:click="addCCommand()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Command
        </button>
      </div>

      <div v-if="item.data.commands.length !== 0 ">
        <table
          class="table table-striped table-hover table-condensed">
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr is="commandRow"
              v-for="command in item.data.commands"
              v-bind:item="item"
              v-bind:command="command"
              v-bind:key="command._id">
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</div>
`;
