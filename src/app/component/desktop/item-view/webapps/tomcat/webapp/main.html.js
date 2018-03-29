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
    <td class="webapp-version">
      <inlineInput2
        :value="webapp.version"
        :valid="validation.version"
        :allowEdit="allowEdit"
        inputType="text"
        emptyValue="<em class='text-muted'>version</em>"
        valueName="version"
        v-on:changeValue="changeValue"/>
    </td>

    <td class="tc-actions">

    <div
      v-if="referenceWebapp"
      class="btn-group" style="vertical-align: baseline;">

      <span
        data-toggle="dropdown"
        class="glyphicon glyphicon-info-sign" aria-hidden="true"/>

      <ul class="dropdown-menu dropdown-menu-right">
        <li class="dropdown-header">Open links</li>
        <li title="open documentation in default browser"><a :href="referenceWebapp.url.doc">Documentation</a></li>
        <li title="open CHANGES in default browser"><a :href="referenceWebapp.url.changes">Changes</a></li>
        <li class="dropdown-header">Nexus</li>
        <li title="open RELEASE repository"><a :href="referenceWebapp.url.release">Release</a></li>
        <li title="open SNAPSHOT repository"><a :href="referenceWebapp.url.snapshot">Snapshot</a></li>
      </ul>
    </div>

      <span
        v-on:click="openWebappContext"
        :title="btTitleOpenContext"
        class="glyphicon glyphicon-link" aria-hidden="true"/>

      <span
        v-if="! updateVersionTask || updateVersionTask.status != 'BUSY'"
        v-on:click="refreshVersion"
        title="refresh version"
        class="glyphicon glyphicon-play update-version-button" aria-hidden="true"/>
      <span
        v-else
        title="version update in progress ..."
        class="glyphicon glyphicon-refresh glyphicon-refresh-animate"
        aria-hidden="true" />

      <span
        v-on:click="deleteWebapp()"
        title="delete"
        class="glyphicon glyphicon-remove" aria-hidden="true"/>
    </td>


    </tr>
  </table>



  <div v-if="expanded" class="info-webapp">
    <table class="table info-webapp">
      <tr>
        <td width="70px">
          Context :
        </td>
        <td>
          <inlineInput2
            :value="webapp.contextPath"
            :valid="validation.contextPath"
            inputType="text"
            emptyValue=""
            valueName="contextPath"
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
    </table>


    <table class="info-servlet">
      <thead>
        <tr>
          <th>
            servlets
            <button
              title="Add Servlet"
              v-on:click="addServlet()"
              class="btn btn-default btn-xs"
            >
              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </button>
          </th>
          <th class="servlet-name">Name</th>
          <th class="servlet-class">class</th>
          <th class="servlet-url-pattern">url pattern</th>
          <th></th>
        </tr>
      </thead>
      <tbody
        v-if="webapp.servlets && webapp.servlets.length != 0"
      >
        <tr
          is="servlet"
          v-for="servlet in webapp.servlets" :key="servlet._id"
          :item="item"
          :tomcat="tomcat"
          :webapp="webapp"
          :servlet="servlet"
        >
        </tr>
      </tbody>
    </table>
  </div>
</div>
`;
