module.exports = `
<tr id="module.id" class="init" >
  <td>
    <span class="module-name">{{module.name}}</span>
    <span class="module-id">{{module.id}}</span>
  </td>
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
  </td>

  <td>
  </td>

  <td>
  </td>

  <td>
  </td>

</tr>
`;
