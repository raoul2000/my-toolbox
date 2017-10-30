module.exports = `
<div class="row">
  <div class="col-lg-12">
    <h1>Settings</h1>
    <hr/>
    <form class="form-horizontal">

    <!--// CTDB data folder -->
    <div class="form-group">
      <label for="ctdb-folder" class="col-sm-2 control-label">CTDB base Folder</label>
      <div class="col-sm-10">
        <div class="input-group">
          <input id="ctdb-folder" v-model="ctdbFolderPath"  type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button  @click="selectCTDBFolderPath()" class="btn btn-default" type="button">
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
      <label for="data-folder" class="col-sm-2 control-label">Deploy Folder</label>
      <div class="col-sm-10">
        <div class="input-group">
          <input id="deploy-folder" v-model="deployFolderPath"  type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button  @click="selectDeployFolderPath()" class="btn btn-default" type="button">
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
      <label for="webappfile-path" class="col-sm-2 control-label">Deploy Folder</label>
      <div class="col-sm-10">
        <div class="input-group">
          <input id="webappfile-path" v-model="webappCatalogFilePath"  type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button  @click="selectWebappCatalogFilePath()" class="btn btn-default" type="button">
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




      <hr/>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
        <button type="button" class="btn btn-primary" @click="onSave()">Save</button>
          <button type="button" class="btn btn-default" @click="onCancel()">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</div>
`;
