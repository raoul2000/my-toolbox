module.exports = `
<div>
  <table class="header-tomcat">
    <tr style="background-color: #f7f7f7;color: grey;">
      <td style="padding-right:4px;padding-left: 8px;">
        <span
          v-on:click="toggleWebappView"
          v-bind:class="toggleButtonClass()"
          style="cursor:pointer"
          title="expand/collapse"
          aria-hidden="true"></span>
      </td>
      <td class="header-tomcat-text">
        <span style="color:#c3c3c3;">Tomcat</span>
      </td>
      <td class="header-tomcat-text" width="100%">
        <inlineInput
          :initialValue="tomcat.id"
          :valid="validation.id"
          inputType="text"
          valueName="id"
          emptyValue="<em class='text-muted'>ENTER ID HERE ...</em>"
          v-on:changeValue="changeValue"/>
      </td>
      <td>
        <table>
          <tr>
            <td style="white-space:nowrap; text-align:right">port : </td>
            <td style="white-space:nowrap; min-width:60px; padding-right:5px;">
              <inlineInput
                :initialValue="tomcat.port"
                :valid="validation.port"
                inputType="text"
                valueName="port"
                v-on:changeValue="changeValue"/>
            </td>
          </tr>
        </table>
      </td>
      <td style="white-space:nowrap;text-align:center; padding-right:10px;">
        <a :href="tomcatManagerURL" :title="tomcatManagerURL">manager</a>
      </td>
      <td style="padding-right: 10px;">
          <span
            v-on:click="deleteTomcat()"
            title="Delete Tomcat"
            style="cursor:pointer; color: #fba8a8;"
            class="glyphicon glyphicon-remove" aria-hidden="true"></span>
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
