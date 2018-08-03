module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">

      <h1 v-html="headerHTML"></h1>
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
    </div>
  </div>

  <div class="row">
    <div class="col-lg-2">
      <general-info v-bind:item="item">
      </general-info>
    </div>
    <div class="col-lg-10">
      <ul class="nav nav-tabs">

        <li role="presentation"  v-bind:class="{active : currentTabName == 'server-webapps'}">
          <a v-on:click.stop.prevent="$router.push('webapps')" href="#">Web Apps <span class="badge">{{webappCount}}</span></a>
        </li>
        <!--li role="presentation"  v-bind:class="{active : currentTabName == 'server-entities'}">
          <a v-on:click.stop.prevent="$router.push('entitites')" href="#">Entities</span></a>
        </li>
        <li role="presentation"  v-bind:class="{active : currentTabName == 'server-components'}">
          <a v-on:click.stop.prevent="openTabComponents()" href="#">Components  <span class="badge">{{componentCount}}</span></a>
        </li -->
        <li role="presentation"  v-bind:class="{active : currentTabName == 'server-commands'}">
          <a v-on:click.stop.prevent="$router.push('commands')" href="#">Commands
            <span v-if="item.data.commands.length !== 0 " 
            class="badge" 
            aria-hidden="true">{{item.data.commands.length}}</span>          
          </a>
        </li>
        <li role="presentation" v-bind:class="{active : currentTabName == 'server-notes'}">
          <a v-on:click.stop.prevent="$router.push('notes')" href="#">Notes 
            <span v-if="item.data.notes.length !== 0 " 
              title="There is a note"
              class="glyphicon glyphicon-star" 
              aria-hidden="true"></span>
          </a>
        </li>        
      </ul>

      <router-view></router-view>

    </div>
  </div>

</div>
`;
