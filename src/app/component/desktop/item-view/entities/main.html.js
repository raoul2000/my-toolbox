module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">
  
      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button
          v-on:click="refreshEntities"
          type="button" class="btn btn-default btn-xs"
          :disabled="task && task.status == 'BUSY'">

          <span
            v-if="! task || task.status != 'BUSY'"  
            title="Refresh entities"
            class="glyphicon glyphicon-refresh" aria-hidden="true"/>
          <span
            v-else
            title="refreshing entities ..."
            class="glyphicon glyphicon-refresh glyphicon-refresh-animate"
            aria-hidden="true" />  

        </button>  

        <button
          v-on:click="deleteAllVars"
          :disabled="item.data.vars.length === 0"
          type="button" class="btn btn-default btn-xs">
          <span
            title="Delete All Vars"
            class="glyphicon glyphicon-remove" 
            aria-hidden="true">
          </span>
        </button>      
        
      </div>

      <input
        v-if="item.data.vars.length !== 0"
        ref="inputVarNameFilter"
        title="(ctrl+f) filter by name"
        class="webapp-filter"
        v-model="filterText" type="text" placeholder="enter filter ..."/>      
    
      <div 
        v-if=" item.data.vars.length === 0 "
        class="alert alert-info" role="alert">
          No entity has been loaded yet
      </div>
      <div v-else>
        <table class="table table-striped table-hover table-condensed">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variable in filteredVars">
              <td>{{variable.name}}</td>
              <td>{{variable.value}}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</div>
`;
