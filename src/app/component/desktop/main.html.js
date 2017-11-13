module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <h1>Desktop</h1>
      <hr/>
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
      </div> <!-- toolbar end -->
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12">
      <ul class="cards">
        <li
          v-for="(item, index)  in items"
          :title="item.file"
          class="card_item">

          <div class="card">
    					<div class="card_content">
    							<h2 class="card_heading" :title="item.data.name">{{ item.data.name }}</h2>

                  <div class="btn-group btn-group-sm" role="group">
                    <button
                      @click="removeFromDesktop(index)" type="button" class="btn btn-sm btn-default">
                      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                    <button @click="view(index)" type="button" class="btn btn-sm btn-default">
                      <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                    </button>
                  </div> <!-- toolbar end -->
    					</div>
    			</div>

        </li>
      </ul>
    </div>
  </div>

</div>
`;
