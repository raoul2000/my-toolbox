module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <div v-html="HTMLHeader"></div>
      <h1>{{name}}</h1>
      <hr/>
      <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a v-on:click.stop.prevent="openTabHome()" href="#">Settings</a></li>
        <li role="presentation"><a v-on:click.stop.prevent="openTabProfile()" href="#">Profile</a></li>
      </ul>
    </div>
  </div>


  <div class="row">
    <div class="col-lg-12">
    <router-view>
    </router-view>

    </div>
  </div><!--// row -->

</div>
`;
