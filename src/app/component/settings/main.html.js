module.exports = `
<transition
  name="custom-classes-transition"
  enter-active-class="animated fadeIn"
>
<div class="row">
  <div class="col-lg-12">
    <div class="pull-right">
      <button
        class="btn btn-default btn-lg"
        v-on:click="onCancel()">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Cancel
      </button>
    </div>
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

    <!--// BEGIN Command Library File Path-->
    <div class="form-group">
      <label for="cmdlib-file-path" class="col-sm-3 control-label">Command Library</label>
      <div class="col-sm-9">
        <div class="input-group">
          <input id="cmdlib-file-path" v-model="commandLibraryFilePath"  type="text" class="form-control" placeholder="">
          <span class="input-group-btn">
            <button
              @click="selectCommandLibraryFilePath()"
              title="select a new file"
              class="btn btn-default" type="button">
              <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
            </button>
          </span>
        </div>
        <span id="helpBlock" class="help-block">
          Command LibraryFile path
        </span>
      </div>
    </div>
    <!--// END Command Library File Path -->

    <!-- // BEGIN - persistent desktop -->
    <div class="form-group">
      <div class="col-sm-offset-3 col-sm-9">
        <div class="checkbox">
          <label>
            <input v-model="persistentDesktop" type="checkbox"> Reload last desktop on startup
          </label>
        </div>
      </div>
    </div>
    <!-- // END - persistent desktop -->

    <!-- // BEGIN - desktop group by category -->
    <div class="form-group">
      <div class="col-sm-offset-3 col-sm-9">
        <div class="checkbox">
          <label>
            <input v-model="desktopGroupByCategory" type="checkbox"> Group desktop items by category
          </label>
        </div>
      </div>
    </div>
    <!-- // END - desktop group by category -->

    <!-- // BEGIN - expand Tomcat View -->
    <div class="form-group">
      <div class="col-sm-offset-3 col-sm-9">
        <div class="checkbox">
          <label>
            <input v-model="expandTomcatView" type="checkbox"> Expand Tomcat View
          </label>
        </div>
      </div>
    </div>
    <!-- // END - expand Tomcat View  -->

    <!-- // BEGIN - expand Webapp View -->
    <div class="form-group">
      <div class="col-sm-offset-3 col-sm-9">
        <div class="checkbox">
          <label>
            <input v-model="expandWebappView" type="checkbox"> Expand Webapp View
          </label>
        </div>
      </div>
    </div>
    <!-- // END - expand Webapp View  -->

    <!-- // BEGIN - check save PWD session -->
    <div class="form-group">
      <div class="col-sm-offset-3 col-sm-9">
        <div class="checkbox">
          <label>
            <input v-model="checkSavePwdToSession" type="checkbox"> Check the "Remember my password for this session" by default
          </label>
        </div>
      </div>
    </div>
    <!-- // END - check save PWD session  -->

    <!-- // BEGIN - theme -->
    <div class="form-group" style="display:none">
      <label for="theme-name" class="col-sm-3 control-label">Theme</label>
      <div class="col-sm-9">
        <select
          v-model="themeName"
          id="theme-name"
        >
          <option value="null" selected="selected">default</option>
          <option value="cerulean">Cerulean</option>
          <option value="flatly">Flatly</option>
        </select>
        <span id="helpThemeName" class="help-block">
          User interface theme
        </span>
      </div>
    </div>
    <!-- // END - theme  -->

      <hr/>
      <div class="form-group">
        <div class="col-sm-offset-3 col-sm-9">
        <button type="button" class="btn btn-primary" @click="onSave()">Save Changes</button>
        </div>
      </div>
    </form>
  </div>
</div>
</transition>
`;
