module.exports = `
<div class="row">
  <div class="col-lg-12">
    <h1>Settings</h1>
    <hr/>
    <form class="form-horizontal">

    <!--// CTDB data folder -->
    <div class="form-group">
      <label for="ctdb-folder" class="col-sm-3 control-label">CTDB base Folder</label>
      <div class="col-sm-9">
        <div class="input-group">
          <input id="ctdb-folder" v-model="ctdbFolderPath"  type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button
              @click="selectCTDBFolderPath()"
              title="select a new folder"
              class="btn btn-default" type="button">
              <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
            </button>
          </span>
        </div>
        <span id="helpBlock" class="help-block">
          CTDB Path
        </span>
      </div>
    </div>
    <!--// CTDB data folder -->

    <!--// BEGIN deploy folder -->
    <div class="form-group">
      <label for="deploy-folder" class="col-sm-3 control-label">Deploy Folder</label>
      <div class="col-sm-9">
        <div class="input-group">
          <input id="deploy-folder" v-model="deployFolderPath"  type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button
              @click="selectDeployFolderPath()"
              title="select a new folder"
              class="btn btn-default" type="button">
              <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
            </button>
          </span>
        </div>
        <span id="helpBlock" class="help-block">
          Local folder where files are downloaded from maven, and deployed to server
        </span>
      </div>
    </div>
    <!--// END deploy folder -->


    <!--// BEGIN webapp Catalog File Path-->
    <div class="form-group">
      <label for="webappfile-path" class="col-sm-3 control-label">Webapp Catalog</label>
      <div class="col-sm-9">
        <div class="input-group">
          <input id="webappfile-path" v-model="webappCatalogFilePath"  type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button
              @click="selectWebappCatalogFilePath()"
              title="select a new file"
              class="btn btn-default" type="button">
              <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
            </button>
          </span>
        </div>
        <span id="helpBlock" class="help-block">
          Web App Catalog File path
        </span>
      </div>
    </div>
    <!--// END webapp Catalog File Path -->

    <!--// BEGIN putty File Path-->
    <div class="form-group">
      <label for="puttyfile-path" class="col-sm-3 control-label">Putty</label>
      <div class="col-sm-9">
        <div class="input-group">
          <input id="puttyfile-path" v-model="puttyFilePath"
            type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button
              @click="selectPuttyFilePath()"
              title="select the putty.exe file"
              class="btn btn-default" type="button">
              <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
            </button>
          </span>
        </div>
        <span id="helpBlock" class="help-block">
          The Putty Program file is used to open an SSH console on the server
        </span>
      </div>
    </div>
    <!--// END putty File Path -->

    <!--// BEGIN winscp File Path-->
    <div class="form-group">
      <label for="winscp-path" class="col-sm-3 control-label">WinSCP</label>
      <div class="col-sm-9">
        <div class="input-group">
          <input id="winscp-path" v-model="winscpFilePath"
            type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button
              @click="selectWinscpFilePath()"
              title="select the winscp.exe file"
              class="btn btn-default" type="button">
              <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
            </button>
          </span>
        </div>
        <span id="helpBlock" class="help-block">
          WinSCP is used to open an SFTP connection to the server
        </span>
      </div>
    </div>
    <!--// END winscp File Path -->



      <hr/>
      <div class="form-group">
        <div class="col-sm-offset-3 col-sm-9">
        <button type="button" class="btn btn-primary" @click="onSave()">Save</button>
          <button type="button" class="btn btn-default" @click="onCancel()">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</div>
`;
