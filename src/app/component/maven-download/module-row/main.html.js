module.exports = `
<tr id="module.id" class="init" >
  <td width="90px">
    <div class="btn-group">
      <button
        v-on:click="loadVersionInfo()"
        type="button" class="btn btn-sm btn-default chk-module" data-toggle="tooltip" title="download version info">
        <span class="glyphicon glyphicon-download" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="caret"></span>
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <ul class="dropdown-menu nx-external-link-open">
        <li class="dropdown-header">Open links</li>
        <li title="open documentation in default browser"><a :href="module.url.doc">Documentation</a></li>
        <li title="open CHANGES in default browser"><a :href="module.url.changes">Changes</a></li>
      </ul>
    </div>

  </td>
  <td>{{module.id}}</td>
  <td>{{module.name}}</td>
  <td nowrap="true">
    <div v-if="status != 'LOADING_VERSION' && moduleVersionOptions.length != 0 ">

      <select
        v-model="selectedModuleType">
        <option v-for="option in moduleTypeOptions" v-bind:value="option">
          {{ option }}
        </option>
      </select>

      <select
        v-model="selectedVersion">
        <option :value="null" selected="selected">select version ...</option>
        <option v-for="option in moduleVersionOptions" v-bind:value="option">
          {{ option }}
        </option>
      </select>

    </div>

    <div v-else-if="status == 'LOADING_VERSION'">
      <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span> Loading ...
    </div>
  </td>

  <td>
    <div v-if="status == 'LOADING_FILENAME'">
      <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span> Loading ...
    </div>

    <div v-else-if="filenameOptions.length > 1">
      <select
        v-model="selectedFilename">
        <option v-for="option in filenameOptions" v-bind:value="option.text">
          {{ option.text }}
        </option>
      </select>
    </div>
    <div v-else-if="filenameOptions.length == 1">
      {{selectedFilename}}
    </div>
    <div v-else-if="filenameOptions.length == 0">
      <em>no file available</em>
    </div>


  </td>

  <td nowrap="true">
    <div
      v-if="selectedFilename != ''">
      <button
        v-on:click="startDownload()" type="button" class="btn btn-default btn-xs" title="start download">
        <span class="glyphicon glyphicon-play"  aria-hidden="true"></span>
      </button>
      <button type="button" :disabled="status == 'DOWNLOAD_IN_PROGRESS'" class="btn btn-default btn-xs" title="cancel download">
        <span class="glyphicon glyphicon-stop" aria-hidden="true"></span>
      </button>
    </div>
  </td>
  <td>
    <div class="download-status" style="display:none">
      <div class="download-success">
        <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </div>
      <div class="download-error">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
      <span class="downloaded-filename"></span>
    </div>

  </td>
</tr>
`;
