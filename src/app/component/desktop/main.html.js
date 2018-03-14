module.exports = `
<div>
  <div class="row">
    <div class="col-lg-12">
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
      </div> <!-- toolbar end -->
    </div>
  </div>

  <div v-if="groupByCategory" class="row">
  	<div
  		v-for="(category, categoryIndex)  in topLevelCategories"
  		class="col-xs-12"
    >

      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title pull-left">
            <span class="glyphicon glyphicon-th" aria-hidden="true"></span> {{category}}
          </h3>
          <div class="pull-right category-panel-icon">
            <span
              title="remove from desktop"
              @click.stop.prevent="removeGroupFromDesktop(category)"
              class="glyphicon glyphicon-trash"
              aria-hidden="true"></span>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="panel-body">

          <div
      			v-for="(item, index)  in itemsByCategory(category)"
      			:title="item.file" class="card-container" :id="getItemElementId(item.data)"
      		>
      			<div
      				@click="viewDetail(item, $event)"
      				v-bind:class="cardItemStyle(item)"
      			>
      				<div
      					@click.stop.prevent="removeFromDesktop(item)"
      					title="remove from desktop"
      					type="button"
      					class="left-corner-icon"
      				>
      					<span class="glyphicon glyphicon-trash" aria-hidden="true"/>
      				</div>
      				<div class="shape">
      					<div class="shape-text"/>
      				</div>
      				<div class="project-content">
      					<div v-html="cardItemContent(item)"/>
      				</div>
      			</div>
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
          v-bind:class="cardItemStyle(item)">
          <div
            @click.stop.prevent="removeFromDesktop(item)"
            title="remove from desktop"
            type="button"
            class="left-corner-icon">
            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </div>
          <div class="shape">
            <div class="shape-text" >
            </div>
          </div>
          <div class="project-content">
            <div v-html="cardItemContent(item)"></div>
          </div>
        </div>
      </div> <!-- card-container -->

    </div>
  </div><!-- row -->

</div>
`;
