module.exports = `

<div class="row">
  <div class="col-lg-12">

    <table
      v-if="modules.length != 0"
      class="table table-striped table-hover table-condensed">
      <thead>
        <tr>
          <th></th>
          <th>filename</th>
          <th>version</th>
          <th>symlink</th>
          <th>install Folder</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="module in modules">
          <tr style="background-color: white">
            <td>

            </td>
            <td>
              {{module.dataFilename}}
            </td>
            <td>
              {{module.metadata.version}}
            </td>
            <td>
              {{module.metadata.symlink}}
            </td>
            <td>
              {{module.metadata.installFolder}}
            </td>
            <td>
              actions
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div><!-- // col-lg-12 -->
</div><!-- // row -->
`;
