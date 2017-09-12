module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <div v-html="HTMLHeader"></div>
      <h1>{{scan.name}}</h1>
      <hr/>

      <div class="btn-group" role="group" style="margin-bottom:1em;">
        <button
          type="button"
          class="btn btn-default"
          v-bind:disabled="disableAction"
          v-on:click="pingAllURL"
        >
          <span class="glyphicon glyphicon-flash" aria-hidden="true"></span> ping All
        </button>
        <button
          type="button"
          class="btn btn-default"
          v-bind:disabled="disableAction"
          v-on:click="versionAllURL"
          title="get all version number"
        >
          <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Version
        </button>
      </div> <!-- toolbar end -->

    </div>
  </div>


  <div class="row">
    <div class="col-lg-12">
      <table class="table table-striped table-hover table-condensed">
        <thead>
          <tr>
            <th>name</th>
            <th>URL</th>
            <th>version</th>
            <th>status</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="tomcat in summary">
            <tr style="background-color: white">
              <td colspan="5">

                <h3 class="tomcat-id">
                  Tomcat {{ tomcat.id }}
                  <small>{{tomcat.version.value}} - <a href="#" @click.stop.prevent="openTomcatManager(tomcat)">manager</a></small>
                </h3>
              </td>
            </tr>

            <tr is="url-list"
              v-for="item in tomcat.servlet"
              v-bind:item="item"
              v-bind:action="action"
              v-on:action-completed="actionCompleted"
              v-bind:key="item.id">
            </tr>

          </template>
        </tbody>
      </table>
    </div><!-- // col-lg-12 -->
  </div><!-- // row -->


  <div class="row" style="display:none">
    <div class="col-lg-12">

      <div class="detail-view">
        <div v-for="tomcat in scan.tomcat">
          <h2>{{ tomcat.id }} <small>{{ tomcat.installDir}}</small></h2>
          <hr/>
          <p><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> port : {{tomcat.conf.connector.port}} <a href="#" v-on:click.stop.prevent="openTomcatManager(tomcat)">Manager</a></p>
          <ul>
            <li v-for="prop in tomcat.prop">
              {{ prop.name }} : {{ prop.value}}
            </li>
          </ul>
          <div v-for="conf in tomcat.conf.contextList">
            <small>{{ conf.filePath }}</small>
            <div v-for="context in conf.context">
              <ul>
                <li>path : <b>{{ context.path }}</b></li>
                <li>docBase : {{ context.docBase }}
                  <div v-for="servlet in context.servlet">
                    <ul>
                      <li>name : <b>{{ servlet.name}}</b></li>
                      <li v-if="servlet.ref">
                        <b>{{ servlet.ref.name}}</b>
                      </li>
                      <li>class : <code>{{ servlet.class}}</code></li>
                      <li>url patterns : {{ servlet.urlPattern.join(',')}}<br/>&nbsp;</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div><!--// detail-view -->

    </div>
  </div><!--// row -->

</div>
`;
