module.exports = `
<tr>
  <td>
    <input type="checkbox" v-model="module.selected" />
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
`;
