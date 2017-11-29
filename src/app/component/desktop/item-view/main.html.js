module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <div v-html="pageHeader"></div>
      <h1>{{name}}</h1>
      <hr/>

      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button title="open SSH session" v-on:click="openPuttySession()" type="button" class="btn btn-default">
          SSH
        </button>
        <button title="open WinSCP session" v-on:click="openWinscpSession()" type="button" class="btn btn-default">
          SFTP
        </button>
      </div>

      <ul class="nav nav-tabs">
        <li role="presentation" v-bind:class="{active : activeTab == 'settings'}">
          <a v-on:click.stop.prevent="openTabHome()" href="#">Settings</a>
        </li>
        <li role="presentation"  v-bind:class="{active : activeTab == 'profile'}">
          <a v-on:click.stop.prevent="openTabProfile()" href="#">Profile</a>
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
