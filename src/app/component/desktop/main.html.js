module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <h1>Desktop</h1>
      <hr/>
      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button @click="openDesktopItems" type="button" class="btn btn-primary">
          <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
        </button>
        <button @click="createItem" type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
        </button>
      </div> <!-- toolbar end -->
    </div>
  </div>

  <div class="row">
    <div class="col-xs-4" v-for="(item, index)  in items" :title="item.file">
      <h3 class="title">{{ item.data.name }}</h3>
      <p>(index = {{index}})</p>
      <button @click="removeFromDesktop(index)">remove</button>
      <button @click="view(index)">view</button>
    </div>
  </div>

</div>
`;
