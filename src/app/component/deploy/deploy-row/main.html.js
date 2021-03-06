module.exports = `
<tr>
  <td>
    <input type="checkbox" v-model="selected" :disabled="busy"/>
  </td>
  <td>
    {{module.dataFilename}}
  </td>
  <td>
    <span v-if=" ! inEdition">{{module.metadata.version}}</span>
    <span v-else>
      <input
        type="text"
        :value="metadata.version"
        v-on:keyup.stop="updateFormField('version', $event.target.value)"
        placeholder="version number (ex : 2.10.5)"/>
    </span>
  </td>
  <td>
    <span v-if="! inEdition">{{module.metadata.symlink}}</span>
    <span v-else>
      <input
        type="text"
        :value="metadata.symlink"
        v-on:keyup.stop="updateFormField('symlink', $event.target.value)"
        placeholder="symlink name"/>
    </span>
  </td>
  <td>
    <span v-if="!inEdition">{{module.metadata.installFolder}}</span>
    <span v-else>
      <input
        type="text"
        :value="metadata.installFolder"
        v-on:keyup.stop="updateFormField('installFolder', $event.target.value)"
        placeholder="install folder"/>
    </span>
  </td>
  <td>
    <div v-if="inEdition">
      <button
        title="save changes"
        v-on:click="submitChanges()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </button>
    </div>
    <div v-else>
      <button
        title="edit information"
        :disabled="busy"
        v-on:click="enableEditMode()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
      </button>
    </div>
  </td>
  <td>
    <div v-if="step === 'deploy-success'">
      <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
    </div>
    <div v-else-if="step === 'deploy-error'">
      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
    <div v-else-if="status === 'deploying'">
      <div v-if="step === 'connecting'">
        <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span> connecting ...
      </div>
      <div v-else-if="step === 'upload'">

        <span class="progress-percent">{{progress}}</span>
        <div class="progress progress-bar-thin" style="min-width:100px">
          <div class="progress-bar" role="progressbar"  v-bind:style="{width : progress}">
          </div>
        </div>

      </div>
    </div>
  </td>
</tr>
`;
