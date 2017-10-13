module.exports = `
<div class="row">
  <div class="col-lg-12">

  <h2>Deployement</h2>
  <hr/>

  <!-- toolbar -->
  <div class="toolbar-container" style="margin-bottom:1em;">

    <div class="btn-group" role="group" >
      <button v-on:click="refresh()" type="button" class="btn btn-default">
        <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
      </button>
      <button v-on:click="showFolderInExplorer()" type="button" class="btn btn-default">
        <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
      </button>
    </div>

    <div class="btn-group" role="group" >
      <button v-on:click="deleteSelectedModules()" type="button" class="btn btn-default" style="color:_red">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </button>
    </div>

    <div class="btn-group" role="group" aria-label="deploy">
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Deploy ...
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li><a id="btn-deploy-ansible" href="#">Ansible</a></li>
          <li><a v-on:click.stop.prevent="startDeploySSH()" href="#">Direct</a></li>
        </ul>
      </div>
    </div>
  </div> <!-- end toolbar -->


    <table
      v-if="modules.length != 0"
      class="table table-striped table-hover table-condensed">
      <thead>
        <tr>
          <th></th>
          <th>filename</th>
          <th>version</th>
          <th>symlink</th>
          <th>install Folder</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr is="module-row"
          v-for="module in modules"
          v-bind:module="module"
          v-bind:deployFolder="deployFolder"
          v-bind:key="module.dataFilename">
        </tr>
      </tbody>
    </table>

    <div id="modal-deploy-ssh" class="modal fade" tabindex="-1" role="dialog">
    modal
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">About My Toolbox</h4>
          </div>
          <div class="modal-body">
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

  </div><!-- // col-lg-12 -->
</div><!-- // row -->



`;
