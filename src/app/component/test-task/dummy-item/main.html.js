module.exports = `
  <tr class="tc-actions">
    <td>{{item.id}}</td>
    <td>{{item.name}}</td>
    <td>{{item.age}}</td>
    <td>{{item.result}}</td>
    <td>
      <span
        v-if="task === null || task.status !== 'BUSY'"
        v-on:click="processItem"
        class="glyphicon glyphicon-play update-version-button" aria-hidden="true"/>
      <span
        v-else
        class="glyphicon glyphicon-refresh glyphicon-refresh-animate"
        aria-hidden="true" />

    </td>
  </tr>
`;
