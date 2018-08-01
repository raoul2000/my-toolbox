module.exports = `
<div>
  <div class="row">
    <div class="col-lg-12">

      <!-- toolbar BEGIN //////////////////////////////////////////////// -->
      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button
          @click="openDesktopItems"
          title="open ..."
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
        </button>
        <button
          @click="createItem"
          title="create item"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
        </button>
        <button
          @click="clearDesktop"
          title="clear desktop"
          :disabled="items.length == 0"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
        </button>
        <button
          @click="toggleGroup"
          title="toggle group"
          :disabled="items.length == 0"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span>
        </button>
      </div> 
      <!-- toolbar end //////////////////////////////////////////////// -->
      

      <!-- toolbar BEGIN //////////////////////////////////////////////// -->
      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button
          @click="toggleShowTask"
          title="toggle task view"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
        </button>
      </div>
      <!-- toolbar end //////////////////////////////////////////////// -->
    

      <!-- toolbar BEGIN //////////////////////////////////////////////// -->
      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button
          @click="selectAllItems(true)"
          v-bind:disabled="selectedItemCount === items.length "
          title="select all"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
        </button>
        <button
          @click="selectAllItems(false)"
          v-bind:disabled="selectedItemCount === 0 "
          title="deselect all"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
        </button>
        <button
          @click="ping"
          v-bind:disabled="selectedItemCount === 0 "
          title="ping"
          type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-play" aria-hidden="true"></span>
        </button>
      </div>
      <!-- toolbar end //////////////////////////////////////////////// -->

    </div>
  </div>

  <div v-if="groupByCategory" class="row">
  	<div
  		v-for="(category, categoryIndex)  in topLevelCategories"
  		class="col-xs-12"
    >

      <div class="panel panel-default item-group-wrapper">
        <div class="panel-heading">
          <h3 class="panel-title pull-left">
            <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> {{category}}
          </h3>
          <div class="pull-right category-panel-icon">
            <span
              title="add to this group"
              @click.stop.prevent="addItemToGroup(category)"
              class="glyphicon glyphicon-folder-open primary-hover"
              aria-hidden="true"></span>

            <span
              title="create item for this group"
              @click.stop.prevent="createItem(category)"
              class="glyphicon glyphicon-plus primary-hover"
              aria-hidden="true"></span>

            <span
              title="remove this group from desktop"
              @click.stop.prevent="removeGroupFromDesktop(category)"
              class="glyphicon glyphicon-trash danger-hover"
              aria-hidden="true"></span>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="panel-body">
        
          <div
      			v-for="(item, index)  in itemsByCategory(category)"
      			:title="item.file" class="card-container" :id="getItemElementId(item.data)">
          
            <div
              @click="viewDetail(item, $event)"
              class="project project-default"
              v-bind:class="{ 'selected-item' : item.isSelected}">

              <div
                @click.stop.prevent="removeFromDesktop(item)"
                title="remove from desktop"
                type="button"
                class="left-corner-icon">
                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
              </div>

              <div class="shape" v-bind:style="cardItemColor(item)">
                <div class="shape-text" >
                </div>
              </div>

              <div class="project-content">  
                <div v-html="cardItemContent(item)"></div>
                <div class="alive-state">
                  <i 
                    v-if="item.inProgress === true" 
                    class="fa fa-refresh fa-spin">
                  </i>                  
                  <span 
                    v-if="item.isAlive === true" 
                    :title="item.isAliveStatusMessage"
                    class="glyphicon glyphicon-ok" aria-hidden="true" style="color:green">
                  </span>
                  <span 
                    v-else-if="item.isAlive === false" 
                    :title="item.isAliveStatusMessage"
                    class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red">
                  </span>
                </div>  
              </div>
            </div> <!-- // end of project -->  

      		</div><!-- end v-for item-->

         </div><!-- end panel body -->
      </div>

  	</div><!-- topLevelCategories -->
  </div><!-- row -->


  <div v-else class="row">
    <div class="col-xs-12">

      <div
        v-for="(item, index)  in items"
        :title="item.file" class="card-container" :id="getItemElementId(item.data)">
  
        <div
          @click="viewDetail(item, $event)"
          class="project project-default"
          v-bind:class="{ 'selected-item' : item.isSelected}">

          <div
            @click.stop.prevent="removeFromDesktop(item)"
            title="remove from desktop"
            type="button"
            class="left-corner-icon">
            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </div>

          <div class="shape" v-bind:style="cardItemColor(item)">
            <div class="shape-text" >
            </div>
          </div>

          <div class="project-content">  
            <div v-html="cardItemContent(item)"></div>
            <div class="alive-state">
              <i 
                v-if="item.inProgress === true" 
                class="fa fa-refresh fa-spin">
              </i>                  
              <span 
                v-if="item.isAlive === true" 
                :title="item.isAliveStatusMessage"
                class="glyphicon glyphicon-ok" aria-hidden="true" style="color:green">
              </span>
              <span 
                v-else-if="item.isAlive === false" 
                :title="item.isAliveStatusMessage"
                class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red">
              </span>
            </div>  
          </div>
        </div> <!-- // end of project --> 

      </div> <!-- card-container -->

    </div>
  </div><!-- row -->

</div>
`;
