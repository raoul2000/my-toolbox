module.exports = `
<div class="webapp-container">

  <table class="header-webapp">
    <tr>
    <td style="padding-right:4px">
      <span
        v-on:click="toggleDetailView"
        v-bind:class="toggleButtonClass()"
        style="cursor:pointer;color: #999;"
        title="expand/collapse"
        aria-hidden="true"></span>
    </td>
    <td class="header-webapp-text" width="100%">
      <inlineInput2
        :value="webapp.name"
        :valid="validation.name"
        inputType="text"
        emptyValue="<em class='text-muted'>ENTER WEBAPP NAME HERE ...</em>"
        valueName="name"
        v-on:changeValue="changeValue"/>
    </td>
    <td style="white-space:nowrap;text-align:center; padding-right:10px;">
      <a :href="webappURL" :title="webappURL">open</a>
    </td>
    <td>
      <span
        title="Delete this Webapp" v-on:click="deleteWebapp()"
        style="cursor:pointer; color:#fba8a8;"
      class="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </td>
    </tr>
  </table>

  <table v-if="expanded" class="info-webapp">
    <tr>
      <td class="field-label-right">
        path :
      </td>
      <td width="100%">
        <inlineInput2
          :value="webapp.path"
          :valid="validation.path"
          inputType="text"
          valueName="path"
          emptyValue="<em class='text-muted'>home page path</em>"
          v-on:changeValue="changeValue"/>
      </td>
      <td class="field-label-right">
        ID :
      </td>
      <td width="100%">
        <select
          v-model="referenceWebappSelection">
          <option :value="null" selected="selected">** Custom Webapp **</option>
          <option
            v-for="option in webappDefinitionOptions"
            v-bind:value="option.id">
            {{ option.name }}
          </option>
        </select>

      </td>
    </tr>
  </table>
</div>
`;
