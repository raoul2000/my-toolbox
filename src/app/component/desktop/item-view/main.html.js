module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">

      <h1 v-html="htmlHeader"></h1>
      <hr/>

      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button
          v-for="(item, index)  in toolbarItems"
          :title="item.description"
          v-on:click="runToolbarAction(item.id)"
          type="button" class="btn btn-default"
        >
          <i v-if="item.icon" :class="item.icon" aria-hidden="true"></i>
          {{item.label}}
        </button>
      </div>

      <ul class="nav nav-tabs">
        <li role="presentation" v-bind:class="{active : currentTabName == 'server-settings'}">
          <a v-on:click.stop.prevent="openTabHome()" href="#">General</a>
        </li>
        <li role="presentation"  v-bind:class="{active : currentTabName == 'server-webapps'}">
          <a v-on:click.stop.prevent="openTabWebapp()" href="#">Web Apps <span class="badge">{{webappCount}}</span></a>
        </li>
        <!--li role="presentation"  v-bind:class="{active : currentTabName == 'server-entities'}">
          <a v-on:click.stop.prevent="openTabEntities()" href="#">Entities</span></a>
        </li>
        <li role="presentation"  v-bind:class="{active : currentTabName == 'server-components'}">
          <a v-on:click.stop.prevent="openTabComponents()" href="#">Components  <span class="badge">{{componentCount}}</span></a>
        </li -->
        <li role="presentation"  v-bind:class="{active : currentTabName == 'server-commands'}">
          <a v-on:click.stop.prevent="openTabCommands()" href="#">Commands</a>
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
