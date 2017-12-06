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

      <div
        v-for="(item, index)  in items"
        :title="item.file" class="card-container" :id="'dkitem-idx'+index">

        <div
          @click="viewDetail(index, $event)"
          v-bind:class="cardItemStyle(item)">
          <div
            @click.stop.prevent="removeFromDesktop(index)"
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
