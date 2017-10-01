module.exports = `
<div class="row">
  <div class="col-lg-12">
    <h1>Settings</h1>
    <hr/>
    <form class="form-horizontal">

      <!--// BEGIN data folder -->
      <div class="form-group">
        <label for="data-folder" class="col-sm-2 control-label">Data Folder</label>
        <div class="col-sm-10">
          <div class="input-group">
            <input id="data-folder" v-model="dataFolder"  type="text" class="form-control" placeholder="">
            <span class="input-group-btn">
              <button  @click="selectDataFolder()" class="btn btn-default" type="button">
                <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
              </button>
            </span>
          </div>
          <span id="helpBlock" class="help-block">
            Path to the existing local folder where data are stored.
          </span>
        </div>
      </div>
      <!--// END data folder -->


      <div class="form-group">
        <label for="data-folder" class="col-sm-2 control-label">Deploy Folder</label>
        <div class="col-sm-10">
          <div class="input-group">
            <input id="deploy-folder" v-model="deployFolder"  type="text" class="form-control" placeholder="">
            <span class="input-group-btn">
              <button  @click="selectDeployFolder()" class="btn btn-default" type="button">
                <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
              </button>
            </span>
          </div>
          <span id="helpBlock" class="help-block">
            Local folder where files to deploy are located.
          </span>
        </div>
      </div>

      <div class="input-group">
        <input id="deploy-folder" v-model="deployFolder"  type="text" class="form-control" placeholder="">
        <span class="input-group-btn">
          <button  @click="selectDeployFolder()" class="btn btn-default" type="button">
            <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
          </button>
        </span>
      </div>
      <span id="helpBlock" class="help-block">
        Local folder where files to deploy are located.
      </span>



      <div class="form-group">
        <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
        <div class="col-sm-10">
          <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <div class="checkbox">
            <label>
              <input type="checkbox"> Remember me
            </label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="button" class="btn btn-default" @click="onCancel()">Cancel</button>
          <button type="button" class="btn btn-primary" @click="onSave()">Save</button>
        </div>
      </div>
    </form>
  </div>
</div>
`;
