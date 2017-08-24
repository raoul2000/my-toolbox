module.exports = `
<div>

  <div class="row">
    <div class="col-lg-12">
      <h1>{{scan.name}}</h1>
      <hr/>
    </div>
  </div>

  <div class="row">
    <div class="col-lg-12">
      <div class="summary-view">
        <div v-for="tomcat in scan.tomcat">
          <h3>{{ tomcat.id }}</h3>
          <hr/>
          <p><a href="#" @click.stop.prevent="openTomcatManager(tomcat)">manager</a></p>
          <ul>
            <template v-for="conf in tomcat.conf.contextList">
              <template v-for="context in conf.context">
                    <template v-for="servlet in context.servlet">
                        <li v-if="servlet.ref">
                          <b>{{ servlet.ref.name}}</b>
                          http://{{scan.ssh.host}}:{{tomcat.conf.connector.port}}{{context.path}}
                        </li>
                    </template>
              </template>
            </template>
          </ul>
        </div>
      </div><!--// summary-view -->
    </div>
  </div><!--// row -->

  <div class="row">
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
