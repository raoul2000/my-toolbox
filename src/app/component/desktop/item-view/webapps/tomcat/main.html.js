module.exports = `
<div>
  <table class="header-tomcat">
    <tr>
      <td style="padding-right:4px">
        <span
          v-on:click="toggleWebappView"
          v-bind:class="toggleButtonClass()"
          style="cursor:pointer"
           aria-hidden="true"></span>
      </td>
      <td class="header-tomcat-text">
        Tomcat
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
      <td>
          <span
            v-on:click="deleteTomcat()"
            title="Delete Tomcat"
            style="cursor:pointer; color:red"
            class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </td>
    </tr>
  </table>

  <div
    class="webapps-container"
    v-if="expanded">

    <div class="btn-group btn-group-sm secondary-toolbar" role="group">
      <button title="Add Webapp" v-on:click="addWebapp()" type="button" class="btn btn-default btn-xs">
        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> webapp
      </button>
    </div>

    <div
      class="single-webapp-container"
      v-for="webapp in tomcat.webapps" :key="webapp._id">
      <webapp
        :item="item"
        :tomcat="tomcat"
        :webapp="webapp"/>
    </div>
  </div>
</div>
`;
