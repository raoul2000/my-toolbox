module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <div v-html="pageHeader"></div>
      <h1>{{item.name}}</h1>
      <hr/>

      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button title="open SSH session with Putty" v-on:click="openPuttySession()" type="button" class="btn btn-default">
          <i class="fa fa-terminal" aria-hidden="true"></i> ssh
        </button>
        <button title="open WinSCP session" v-on:click="openWinscpSession()" type="button" class="btn btn-default">
          <span class="glyphicon glyphicon-transfer" aria-hidden="true"/> sFtp
        </button>
      </div>

      <ul class="nav nav-tabs">
        <li role="presentation" v-bind:class="{active : currentTabName == 'server-settings'}">
          <a v-on:click.stop.prevent="openTabHome()" href="#">General</a>
        </li>
        <li role="presentation"  v-bind:class="{active : currentTabName == 'server-webapps'}">
          <a v-on:click.stop.prevent="openTabWebapp()" href="#">Web Apps</a>
        </li>
        <li role="presentation"  v-bind:class="{active : currentTabName == 'server-components'}">
          <a v-on:click.stop.prevent="openTabComponents()" href="#">Components</a>
        </li>
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
