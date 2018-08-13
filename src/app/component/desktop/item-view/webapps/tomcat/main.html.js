module.exports = `
<div>
  <table class="header-tomcat">
    <tr class="cmd-row" v-bind:style="{ borderLeftColor : borderColor }">

      <td style="padding-right:4px;padding-left: 8px;">
        <span
          v-on:click="toggleWebappView"
          v-bind:class="toggleButtonClass()"
          style="cursor:pointer"
          title="expand/collapse"
          aria-hidden="true"></span>
      </td>

      <td class="header-tomcat-text" style="padding: 0.3em;">
        <span style="color:#c3c3c3;">Tomcat</span>
      </td>

      <td class="header-tomcat-text" width="100%">
        <inlineInput
          :initialValue="tomcat.id"
          :valid="validation.id"
          :allowEdit="allowEdit"
          inputType="text"
          valueName="id"
          emptyValue="<em class='text-muted'>ENTER ID HERE ...</em>"
          v-on:changeValue="changeValue"/>
      </td>

      <td title="current version" class="tomcat-version">
        <inlineInput
          :initialValue="tomcat.version"
          :valid="validation.version"
          :allowEdit="allowEdit"
          inputType="text"
          valueName="version"
          emptyValue="<em class='text-muted'>??</em>"
          v-on:changeValue="changeValue"/>
      </td>

      <td style="white-space:nowrap; text-align:right">port : </td>

      <td style="white-space:nowrap; min-width:60px; padding-right:5px;">
        <inlineInput
          :initialValue="tomcat.port"
          :valid="validation.port"
          :allowEdit="allowEdit"
          inputType="text"
          valueName="port"
          v-on:changeValue="changeValue"/>
      </td>

      <td style="white-space: nowrap">

          <a href="#" @click.stop.prevent="openTomcatManager()" :title="btTitleOpenManager" style="font-size: smaller;">
            Manager
          </a>

          <div class="btn-group">
            <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default btn-xs dropdown-toggle"
              style="border: none; background-color: inherit;">
              <span class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span> 
            </button> 
            <ul class="dropdown-menu dropdown-menu-right">             
              <li >
                <a href="#" @click.prevent="checkTomcatIsAlive()">
                  <span class="glyphicon glyphicon-star" aria-hidden="true"/> check is alive
                </a>
              </li> 
              <li>
                <a href="#" @click.prevent="refreshVersion()">
                  <span
                    v-if="! updateVersionTask || updateVersionTask.status != 'BUSY'"
                    title="refresh version"
                    class="glyphicon glyphicon-play update-version-button" aria-hidden="true"/>
                  <span
                    v-else
                    title="version update in progress ..."
                    class="glyphicon glyphicon-refresh glyphicon-refresh-animate"
                    aria-hidden="true" /> Refresh Version
                </a>
              </li> 
              <li role="separator" class="divider"></li> 
              <li>
                <a href="#" @click.prevent="deleteTomcat()">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"/> Delete
                </a>
              </li>
            </ul>
          </div>
          
          
      </td>

    </tr>
  </table>

  <div
    class="webapps-container"
    v-if="expanded">

    <div class="btn-group btn-group-sm secondary-toolbar" role="group" style="margin-left: 1.8em;">
      <button title="Add Webapp" v-on:click="addWebapp()" type="button" class="btn btn-default btn-xs">
        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Add webapp
      </button>
    </div>

    <div
      class="single-webapp-container"
      v-for="webapp in filteredWebapps" :key="webapp._id">
      <webapp
        :item="item"
        :tomcat="tomcat"
        :expandWebapp="expandWebapp"
        :webapp="webapp"/>
    </div>
  </div>
</div>
`;
