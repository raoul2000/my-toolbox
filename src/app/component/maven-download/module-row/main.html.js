module.exports = `
<tr id="module.id" class="init" >
  <td width="90px">
    <div class="btn-group">
      <button
        :disabled="status != 'IDLE'"
        v-on:click="loadVersionInfo()"
        title="download version info"
        type="button" class="btn btn-sm btn-default" data-toggle="tooltip" >
        <span class="glyphicon glyphicon-download" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="caret"></span>
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <ul class="dropdown-menu nx-external-link-open">
        <li class="dropdown-header">Open links</li>
        <li title="open documentation in default browser">
          <a :href="module.url.doc">Documentation</a>
        </li>
        <li title="open CHANGES in default browser"><a :href="module.url.changes">Changes</a></li>
        <li class="dropdown-header">Nexus</li>
        <li title="open RELEASE repository"><a :href="module.url.release">Release</a></li>
        <li title="open SNAPSHOT repository"><a :href="module.url.snapshot">Snapshot</a></li>
      </ul>
    </div>

  </td>
  <td>{{module.id}}</td>
  <td>{{module.name}}</td>
  <td nowrap="true">
    <div v-if="status != 'LOADING_VERSION' && moduleVersionOptions.length != 0 ">

      <select
        :disabled="status != 'IDLE'"
        v-model="selectedModuleType">
        <option v-for="option in moduleTypeOptions" v-bind:value="option">
          {{ option }}
        </option>
      </select>

      <select
        :disabled="status != 'IDLE'"
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
        :disabled="status != 'IDLE'"
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
        v-on:click="startDownload()"
        :disabled="status == 'DOWNLOAD_IN_PROGRESS'"
        type="button" class="btn btn-default btn-xs" title="start download">
        <span class="glyphicon glyphicon-play"  aria-hidden="true"></span>
      </button>
      <button
        v-on:click="stopDownload()"
        type="button" :disabled="status != 'DOWNLOAD_IN_PROGRESS'" class="btn btn-default btn-xs" title="cancel download">
        <span class="glyphicon glyphicon-stop" aria-hidden="true"></span>
      </button>
    </div>
  </td>

  <td>
    <div v-if="downloadTask">
      <div v-if="downloadTask.status === 'success'">
        <span title="download success" class="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </div>
      <div v-else-if="downloadTask.status === 'error'">
        <span title="download error" class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
      <div v-else-if="downloadTask.status === 'abort'">
        <span title="download aborted by user" class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>
      </div>
      <div v-else-if="downloadTask.status === 'connect'">
        <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span> connecting...
      </div>
      <div v-else-if="downloadTask.status === 'downloading'">
        <span class="progress-percent">{{downloadTask.progress}}%</span>
        <div class="progress progress-bar-thin" style="min-width:100px">
          <div class="progress-bar" role="progressbar"  v-bind:style="{width : downloadTask.progress + '%'}">
          </div>
        </div>
      </div>
    </div>
  </td>

</tr>
`;
