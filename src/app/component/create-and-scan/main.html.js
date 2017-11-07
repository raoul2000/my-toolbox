module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <h1>Create</h1>
      <hr/>
      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button v-bind:disabled="!canSaveScanResult"
          @click="saveScanResult"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
        </button>
      </div> <!-- toolbar end -->
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12">
      <form class="form-horizontal">
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label">Name</label>
          <div class="col-sm-10">
            <input v-model.trim="scan.name"
              type="text" class="form-control input-lg" id="name" placeholder="Item Name" required="required">
          </div>
        </div>
        <div class="form-group">
          <label for="hostname" class="col-sm-2 control-label">Host</label>
          <div class="col-sm-10">
            <input v-model.trim="scan.ssh.host"
              type="text" class="form-control" id="hostname" placeholder="IP or hostname" required="required">
          </div>
        </div>
        <div class="form-group">
          <label for="port" class="col-sm-2 control-label">Port</label>
          <div class="col-sm-10">
            <input  v-model.number="scan.ssh.port"
              type="number" class="form-control" id="port" placeholder="port (default : 22)">
          </div>
        </div>
        <div class="form-group">
          <label for="username" class="col-sm-2 control-label">Username</label>
          <div class="col-sm-10">
            <input v-model.trim="scan.ssh.username"
              type="text" class="form-control" id="username" placeholder="username" required="required">
          </div>
        </div>
        <div class="form-group">
          <label for="password" class="col-sm-2 control-label">Password</label>
          <div class="col-sm-10">
            <input v-model="scan.ssh.password"
              type="password" class="form-control" id="password" placeholder="Password">
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button
              v-bind:disabled="!canStartScan"
              v-on:click="startScan(true)" type="button" class="btn btn-primary">Start</button>

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
      </form>
    </div>
  </div>


  <div class="row">
    <div class="col-lg-12">

      <div class="detail-view">
        <div v-for="tomcat in scan.tomcat">
          <h2>{{ tomcat.id }} <small>{{ tomcat.installDir}}</small></h2>
          <hr/>
          <p><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> port : {{tomcat.conf.connector.port}} <a href="#" v-on:click.stop.prevent="openTomcatManager(tomcat)">Manager</a></p>
          <ul>
            <li v-for="prop in tomcat.prop">
              {{ prop.name }} : {{ prop.value}}
            </li>
          </ul>
          <div v-for="conf in tomcat.conf.contextList">
            <small>{{ conf.filePath }}</small>
            <div v-for="context in conf.context">
              <ul>
                <li>path : <b>{{ context.path }}</b></li>
                <li>docBase : {{ context.docBase }}
                  <div v-for="servlet in context.servlet">
                    <ul>
                      <li>name : <b>{{ servlet.name}}</b></li>
                      <li v-if="servlet.ref">
                        <b>{{ servlet.ref.name}}</b>
                      </li>
                      <li>class : <code>{{ servlet.class}}</code></li>
                      <li>url patterns : {{ servlet.urlPattern.join(',')}}<br/>&nbsp;</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>


    </div>
  </div>

</div>
`;
