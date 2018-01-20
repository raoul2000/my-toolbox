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



  <div v-if="expanded" class="info-webapp">
    <table class="table info-webapp">
      <tr>
        <td width="70px">
          context :
        </td>
        <td>
          <inlineInput2
            :value="webapp.context"
            :valid="validation.context"
            inputType="text"
            emptyValue=""
            valueName="context"
            v-on:changeValue="changeValue"/>
        </td>
        <td width="50%" colspan="3">
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
      <tr
        v-if="webapp.servlets.length != 0"
        style="border-bottom: 1px solid #555;"
      >
        <td>servlets</td>
        <td>Name</td>
        <td>url pattern</td>
        <td>class</td>
        <td></td>
      </tr>
      <template
        class="single-webapp-container"
        v-for="servlet in webapp.servlets" :key="servlet._id">
        <servlet
          :item="item"
          :tomcat="tomcat"
          :webapp="webapp"
          :servlet="servlet"
        />
      </template>

    </table>
  </div>
</div>
`;
