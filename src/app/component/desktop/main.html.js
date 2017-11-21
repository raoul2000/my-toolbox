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
                  <small>{{itemPath(item)}}</small>

                  <div class="btn-group btn-group-xs" role="group">
                    <button @click="view(index)" type="button" class="btn btn-xs btn-default">
                      <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                    </button>
                    <div class="btn-group">
                      <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="glyphicon glyphicon-option-horizontal" aria-hidden="true"></span>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a
                            @click.stop.prevent="openPuttySession(item)"
                            href="#">
                            SSH
                          </a>
                        </li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" class="divider"></li>
                        <li title="Remove from desktop"><a
                           @click.stop.prevent="removeFromDesktop(index)"
                           href="#">
                           <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
                          </a></li>
                      </ul>
                    </div>
                  </div> <!-- toolbar end -->
    					</div>
    			</div>

        </li>
      </ul>
    </div>
  </div>

</div>
`;
