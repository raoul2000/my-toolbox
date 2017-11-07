module.exports = `
<div class="row">
  <div class="col-lg-12">

  <h2>Deployement</h2>
  <hr/>

  <!-- toolbar -->
  <div class="toolbar-container" style="margin-bottom:1em;">

    <div class="btn-group" role="group" >
      <button title="update list" v-on:click="refresh()" type="button" class="btn btn-default">
        <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
      </button>
      <button title="open download folder" v-on:click="showFolderInExplorer()" type="button" class="btn btn-default">
        <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
      </button>
    </div>

    <div class="btn-group" role="group" >
      <button title="delete selected file(s)" v-on:click="deleteSelectedModules()" type="button" class="btn btn-danger">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </button>
    </div>

    <div class="btn-group" role="group" >
      <button title="deploy (SSH)" v-on:click="enterSSHSettings()" type="button" class="btn btn-primary">
        <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
      </button>
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
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        <tr is="deploy-row"
          v-for="module in modules"
          v-bind:module="module"
          v-bind:deployFolderPath="deployFolderPath"
          v-bind:key="module.dataFilename">
        </tr>
      </tbody>
    </table>

    <!-- /.modal -->

    <div id="modal-deploy-ssh" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Deploy SSH</h4>
          </div>
          <div class="modal-body">

            <form v-on:submit.prevent="startDeploySSH()" class="form-horizontal"
              data-toggle="validator" data-disable="true">

              <div class="form-group">
                <label for="ssh-hostname" class="col-sm-3 control-label">Host</label>
                <div class="col-sm-8">
                  <input
                    v-model="ssh.host"
                    required title="target server hostname or IP address"
                    type="text" class="form-control" placeholder="hostname or IP address">
                </div>
              </div> <!-- input ssh hostname -->

              <div class="form-group">
                <label for="ssh-port" class="col-sm-3 control-label">SSH Port</label>
                <div class="col-sm-3">
                  <input
                    v-model="ssh.port"
                    title="SSH Port"
                    type="number" class="form-control" placeholder="default : 22">
                </div>
              </div> <!-- input ssh port -->

              <div class="form-group">
                <label for="ssh-username" class="col-sm-3 control-label">Username</label>
                <div class="col-sm-6">
                  <input
                    v-model="ssh.username"
                    required
                     title="SSH login name"
                    type="text" class="form-control" placeholder="">
                </div>
              </div> <!-- input ssh username -->

              <div class="form-group">
                <label for="ssh-password" class="col-sm-3 control-label">Password</label>
                <div class="col-sm-6">
                  <input
                    v-model="ssh.password"
                    required title="SSH login password"
                    type="password" class="form-control" placeholder="">
                </div>
              </div> <!-- input ssh password -->

              <div class="form-group">
                <label for="ssh-target-path" class="col-sm-3 control-label">Target Folder</label>
                <div class="col-sm-8">
                  <input
                    v-model="targetPath"
                     required
                     title="Remote install folder root path"
                    type="text" class="form-control" placeholder="">
                </div>
              </div> <!-- input ssh target-path -->

              <div class="form-group">
                <label for="ssh-target-path" class="col-sm-3 control-label">&nbsp;</label>
                <div class="col-sm-8">

                  <div class="checkbox">
                    <label>
                      <input type="checkbox" value="">
                        Only upload the file
                    </label>
                  </div>

                </div>
              </div> <!-- input download only -->

              <div class="form-group">
                <div class="col-sm-3">&nbsp;</div>
                <div class="col-sm-8">
                  <hr/>
                  <button title="start deployment" type="submit" class="btn btn-primary">
                    Deploy Now
                  </button>
                  <button title="cancel deployment" type="button" class="btn btn-default" data-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>

    <!-- /.modal -->

  </div><!-- // col-lg-12 -->
</div><!-- // row -->



`;
