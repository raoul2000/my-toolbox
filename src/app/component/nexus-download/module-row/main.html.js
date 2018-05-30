module.exports = `
<tr id="module.id" class="init" >
  <td width="90px">
    <div class="btn-group">
      <button
        v-on:click="loadVersionInfo()"
        type="button" class="btn btn-sm btn-default">
        <span v-if="loadingVersionInfo" class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span>
        <span v-else class="glyphicon glyphicon-download" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="caret"></span>
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <ul class="dropdown-menu">
        <li title="open documentation in default browser"><a :href="module.url.doc">Documentation</a></li>
        <li title="open CHANGES in default browser"><a :href="module.url.changes">Changes</a></li>
        <li title="open RELEASE repository"><a :href="module.url.release">Release</a></li>
        <li title="open SNAPSHOT repository"><a :href="module.url.snapshot">Snapshot</a></li>
      </ul>
    </div>
  </td>
  <td>
    <span class="module-name">{{module.name}}</span>
    <span class="module-id">{{module.id}}</span>
  </td>
  <td>
    <div v-if="moduleTypeOptions.length != 0">
      <select
        :disabled="status != 'IDLE'"
        v-model="selectedModuleType">
        <option :value="null" selected="selected">select type ...</option>
        <option v-for="option in moduleTypeOptions" v-bind:value="option">
          {{ option }}
        </option>
      </select>
    </div>


    <div v-if="moduleVersionOptions.length > 1">
      <select
        :disabled="status != 'IDLE'"
        v-model="selectedVersion">
        <option :value="null" selected="selected">select version ...</option>
        <option v-for="option in moduleVersionOptions" v-bind:value="option.resourceURI">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div v-if="version.file.length > 1">
      <select
        :disabled="status != 'IDLE'"
        v-model="selectedFile">
        <option :value="null" selected="selected">select file ...</option>
        <option v-for="option in version.file" v-bind:value="option.resourceURI">
          {{ option.text }}
        </option>
      </select>
    </div>
    <div v-else-if="version.file.length == 1">
      {{version.file[0].text}}
    </div>
    <div v-else-if="version.file.length == 0">
      <em style="color:#ababab;">no file available</em>
    </div>
  </td>

  <td>
  </td>

  <td>
    <div

      <button
        :disabled="selectedFile == null"
        v-on:click="startDownload()"
        type="button" class="btn btn-default btn-xs" title="start download">
        <span class="glyphicon glyphicon-play"  aria-hidden="true"></span>
      </button>

  </td>

  <td>
  </td>

</tr>
`;
