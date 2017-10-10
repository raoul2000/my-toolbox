module.exports = `
<tr>
  <td>
    <input type="checkbox" v-model="module.selected" :disabled="editionMode === true"/>
  </td>
  <td>
    {{module.dataFilename}}
  </td>
  <td>
    <span v-if="editionMode === false">{{module.metadata.version}}</span>
    <span v-else>
      <input type="text" v-model="module.metadata.version" placeholder="version number (ex : 2.10.5)"/>
    </span>
  </td>
  <td>
    <span v-if="editionMode === false">{{module.metadata.symlink}}</span>
    <span v-else>
      <input type="text" v-model="module.metadata.symlink" placeholder="symlink name"/>
    </span>
  </td>
  <td>
    <span v-if="editionMode === false">{{module.metadata.installFolder}}</span>
    <span v-else>
      <input type="text" v-model="module.metadata.installFolder" placeholder="install folder"/>
    </span>
  </td>
  <td>
    <button
      v-if="editionMode === false"
      v-on:click="editionMode = !editionMode" type="button" class="btn btn-default btn-xs">
      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
    </button>

    <button
      v-else
      v-on:click="submitChanges()" type="button" class="btn btn-default btn-xs">
      <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
    </button>

  </td>
</tr>
`;
