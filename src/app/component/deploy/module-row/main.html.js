module.exports = `
<tr>
  <td>
    <input type="checkbox" v-model="selected"/>
  </td>
  <td>
    {{module.dataFilename}}
  </td>
  <td>
    <span v-if=" ! inEdition">{{module.metadata.version}}</span>
    <span v-else>
      <input type="text" v-model="metadata.version" placeholder="version number (ex : 2.10.5)"/>
    </span>
  </td>
  <td>
    <span v-if="! inEdition">{{module.metadata.symlink}}</span>
    <span v-else>
      <input type="text" v-model="metadata.symlink" placeholder="symlink name"/>
    </span>
  </td>
  <td>
    <span v-if="!inEdition">{{module.metadata.installFolder}}</span>
    <span v-else>
      <input type="text" v-model="metadata.installFolder" placeholder="install folder"/>
    </span>
  </td>
  <td>
    <div v-if="inEdition">
      <button
        v-on:click="submitChanges()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </button>
    </div>
    <div v-else>
      <button
        v-if="!inEdition"
        v-on:click="enableEditMode()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
      </button>
    </div>
  </td>
  <td>

  <div class="download-progress">
    <div class="progress-percent">
      <span class="step">{{step}}</span>
      <span class="percent-value">{{progress}}</span>
    </div>

  </div>

  <em>{{status}} busy = {{busy}} ({{step}} {{progress}})</em>
  <div v-if="status === 'success'">
    SUCCESS^
  </div>
  <div v-else-if="status === 'error'">
    ERROR
  </div>
  <div v-else-if="status === 'deploying'">
    {{step}} {{progress}}

    <div class="progress progress-bar-thin" style="min-width:100px">
      <div class="progress-bar" role="progressbar"  v-bind:style="{width : progress}">
      </div>
    </div>

  </div>
  </td>
</tr>
`;
