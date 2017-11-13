module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <h1>Create</h1>
      <hr/>
      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button
          v-bind:disabled="!canSaveServer"
          @click="saveServer()"
          title="save"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
        </button>
      </div> <!-- toolbar end -->
    </div>
  </div>

  <div class="row">
    <form class="form-horizontal">
    <div class="col-xs-6">

        <div class="form-group">
          <label for="name" class="col-sm-2 control-label">Name</label>
          <div class="col-sm-10">
            <input v-model.trim="server.name"
              type="text" class="form-control input-lg" id="name" placeholder="Item Name" required="required">
          </div>
        </div>
        <div class="form-group">
          <label for="hostname" class="col-sm-2 control-label">Host</label>
          <div class="col-sm-10">
            <input v-model.trim="server.ssh.host"
              type="text" class="form-control" id="hostname" placeholder="IP or hostname" required="required">
          </div>
        </div>
        <div class="form-group">
          <label for="port" class="col-sm-2 control-label">Port</label>
          <div class="col-sm-10">
            <input  v-model.number="server.ssh.port"
              type="number" class="form-control" id="port" placeholder="port (default : 22)">
          </div>
        </div>
        <div class="form-group">
          <label for="username" class="col-sm-2 control-label">Username</label>
          <div class="col-sm-10">
            <input v-model.trim="server.ssh.username"
              type="text" class="form-control" id="username" placeholder="username" required="required">
          </div>
        </div>
        <div class="form-group">
          <label for="password" class="col-sm-2 control-label">Password</label>
          <div class="col-sm-10">
            <input v-model="server.ssh.password"
              type="password" class="form-control" id="password" placeholder="Password">
          </div>
        </div>

        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button
              v-bind:disabled="!canTestConnection"
              v-on:click="testConnection" type="button" class="btn btn-primary">

                <span v-show="action === 'test-connection'" class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span>
                <span v-show="connectionOk === true" class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                <span v-show="connectionOk === false" class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red"></span>

                &nbsp;Test Connection
            </button>

          </div>
        </div>

    </div>
    <div class="col-xs-6">
      <div class="form-group">
        <label for="notes" class="col-sm-2 control-label">Notes</label>
        <div class="col-sm-10">
          <textarea
            v-model="server.notes" 
            id="notes" placeholder="Enter your notes here ..." class="form-control" rows="3" style="height:243px"></textarea>
        </div>
      </div>
    </div>
    </form>
  </div>

</div>
`;
