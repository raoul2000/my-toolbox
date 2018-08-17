module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">
  
      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button
          v-on:click="refreshEntities"
          type="button" class="btn btn-default btn-xs"
          title="Refresh entities"
          :disabled="task && task.status == 'BUSY'">

          <span
            v-if="! task || task.status != 'BUSY'"  
            class="glyphicon glyphicon-refresh" aria-hidden="true"/>
          <span
            v-else
            class="glyphicon glyphicon-refresh glyphicon-refresh-animate"
            aria-hidden="true" />  

        </button>  

        <button
          v-on:click="deleteAllVars"
          :disabled="item.data.vars.length === 0"
          title="Delete All Vars"
          type="button" class="btn btn-default btn-xs">
          <span
            class="glyphicon glyphicon-remove" 
            aria-hidden="true">
          </span>
        </button>      
        
      </div>

   
    
      <div 
        v-if=" item.data.vars.length === 0 "
        class="alert alert-info" role="alert">
          No entity has been loaded yet
      </div>
      <table v-else class="table table-striped table-hover table-condensed" style="table-layout: fixed;">
        <thead>
          <tr>
            <th>
              Name
              <input
                ref="inputVarNameFilter"
                title="(ctrl+f) filter by name"
                class="webapp-filter"
                style="float:right; font-weight: normal;"
                v-model="filterNameText" type="text" placeholder="filter on name..."/>  
            </th>
            <th>
              Value
              <input
                ref="inputVarValueFilter"
                title="filter by value"
                class="webapp-filter"
                style="float:right; font-weight: normal;"
                v-model="filterValueText" type="text" placeholder="filter on value ..."/>                   
            </th>
            <th>
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variable in filteredVars">
            <td>{{variable.name}}</td>
            <td>
              <div style="word-break: break-all;">{{variable.value}}</div>
            </td>
            <td>
              {{variable.source}}
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</div>
`;
