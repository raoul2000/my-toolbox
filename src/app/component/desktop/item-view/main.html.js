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

  <a v-on:click.stop.prevent="openColorPicker()" href="#">color ({{item.data.color}})</a>
  
  <div class="row">
    <div class="col-lg-12">
      <router-view>
      </router-view>
    </div>
  </div><!--// row -->

  <!-- modal : (begin)-->
  <div id="color-picker-modal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Choose A Color</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-6">
                <p>Choose the color for this item</p>
                <div class="radio"  v-on:click="optionColor = 'auto'">
                  <label >
                    <input type="radio" name="optionColor" id="optionColor1" value="auto" :checked="optionColor == 'auto'">
                     Automatically assign a color based on the folder path
                  </label>
                </div>
                <div class="radio"  v-on:click="optionColor = 'manual'">
                  <label>
                    <input type="radio" name="optionColor" id="optionColor1" value="manual" :checked="optionColor == 'manual'">
                      Let me choose the color
                  </label>
                </div>                
            </div>
            <div class="col-lg-6">
              <div v-if="optionColor == 'manual'">
                <color-picker :value="colors"   @input="updateColorValue"/>
              </div>
            </div>
          </div>
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" v-on:click="saveColor()">Save changes</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div>
  <!-- modal : (end)-->
</div>
`;
