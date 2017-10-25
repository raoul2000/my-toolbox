module.exports = `
<tr id="module.id" class="init" >
  <td width="90px">
    <div class="btn-group">
      <button type="button" class="btn btn-sm btn-default chk-module" data-toggle="tooltip" title="download version info">
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
    <div class="sel-package-widget">
      <select class="sel-version-cat" name="">
        <option value="release" selected="selected">release</option>
        <option value="snapshot">snapshot</option>
      </select>
      <select class="sel-version-val" name="">
      </select>
    </div>
    <div class="status">
      <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span> Loading ...
    </div>
  </td>

  <td>
    <div class="progress-find-download-file">
      <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate" aria-hidden="true"></span> Loading ...
    </div>

    <div class="download-filename">
      <div class="single-value">
      </div>
      <select class="sel-filename-val multi-value" name="">
        <option>this_is_a long_filename_1234567.war</option>
      </select>
    </div>
  </td>

  <td nowrap="true">
    <div class="action">
      <button type="button" class="but-download-start btn btn-default btn-xs" title="start download">
        <span class="glyphicon glyphicon-play"  aria-hidden="true"></span>
      </button>
      <button type="button" disabled class="but-download-cancel btn btn-default btn-xs" title="cancel download">
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
