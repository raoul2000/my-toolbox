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
          class="table table-hover table-condensed">
          <thead>
            <tr>
              <th>Name</th>
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

  <!-- modal : command (begin)-->
  <div id="edit-cmd-modal" class="modal fade" tabindex="-1" role="dialog">

    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div id="generic-modal-body" class="modal-body">
          <form id="commandForm" method="POST" action="#" novalidate="novalidate">
              <div class="form-group">
                  <label for="name" class="control-label">Name</label>
                  <input type="text" class="form-control" id="name" name="name" value="" required="" title="Enter the command name" >
              </div>
              <div class="form-group">
                  <label for="source" class="control-label">Source</label>
                  <input type="text" class="form-control" id="source" source="name" value="" required="" title="Enter the command source code" >
              </div>
              <button  class="btn btn-success">Save</button>
          </form>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div>
  <!-- modal : Generic (end)-->

</div>
`;
