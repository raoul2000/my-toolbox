module.exports = `
  <tr>
    <td>
      <b>{{item.name}}</b>
    </td>
    <td>
      <a
        v-bind:href="item.url"
        v-on:click.stop.prevent="openUrlExternal"
      >
      {{item.url}}
      </a>
    </td>
    <td>
      {{version}}
    </td>
    <td>
      <span v-show="success === true" class="glyphicon glyphicon-ok" aria-hidden="true" style="display:none; color:green"></span>
      <span v-show="success === false" class="glyphicon glyphicon-remove" aria-hidden="true" style="display:none; color:red"></span>
    </td>
    <td>
      <button
        class="btn btn-sm btn-primary"
        type="button"
        v-on:click="testUrl"
        v-bind:disabled="disabledTest"
      >
        test
      </button>
      <button
        class="btn btn-sm btn-primary"
        type="button"
        v-on:click="getVersion"
        v-bind:disabled="disabledTest"
      >
        version
      </button>
    </td>
  </tr>
`;
