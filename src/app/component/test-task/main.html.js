module.exports = `
<div>
  <h1>Tasks Test Page</h1>
  <hr/>
  <p>use this page to test <b>background queued tasks</b> with the Electron App</p>
  <div class="btn-group" role="group" style="margin-bottom:1em;">
    <button
      @click="createItems"
      type="button" class="btn btn-primary">
      Create Items
    </button>
    <button
      @click="processAllItems"
      type="button" class="btn btn-danger">
      Process All
    </button>
    <button
      @click="startLongTasks"
      type="button" class="btn btn-defaut">
      Start long tasks
    </button>
  </div>


  <div class="row">
    <div class="col-xs-6">
      <h2>Dummy Items</h2>
      <div v-if="items !== null">
        <table class="table">
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>age</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>

          <tr
            is="dummy-item"
            v-for="item in items" :key="item.id"
            :item="item"
          >
          </tr>
        </tbody>
        </table>
      </div>
      <div v-else>
        <h3>No item available : create some right now !!</h3>
      </div>

    </div>



    <div class="col-xs-6">
      <h2>tasks</h2>
      <div v-if="tasks !== null">
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
      <div v-else>
        <h3>No task available</h3>
      </div>
    </div>
  </div>

</div>
`;
