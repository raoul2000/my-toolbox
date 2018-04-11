module.exports = `
<div>
  <h1>Tasks Test Page</h1>
  <hr/>
  <p>use this page to test <b>background queued tasks</b> with the Electron App</p>
  <div class="btn-group" role="group" style="margin-bottom:1em;">
    <button
      @click="startLongTasks"
      type="button" class="btn btn-primary">
      Start long tasks
    </button>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>TaskId</th>
        <th>Status</th>
        <th>Progress</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>

    <tr
      is="task-item"
      v-for="task in tasks" :key="task.id"
      :task="task"
    >
    </tr>
  </tbody>
  </table>
</div>
`;
