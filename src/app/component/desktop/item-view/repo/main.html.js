module.exports = `
<div>
  <div class="row">
    <div class="col-lg-12">

      <div v-if="! isReadOnly" class="btn-group btn-group-sm secondary-toolbar" role="group" >

        <button 
          v-if="item.data.repo.template === null"
          title="Create a repository configuration" v-on:click="createRepoConfig()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Create
        </button>
        <button 
          v-else
          title="Delete repository configuration" v-on:click="deleteRepoConfig()" type="button" class="btn btn-danger btn-xs">
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
        </button>
        
      </div>

      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >

        <button 
          :enabled="item.data.repo.template !== null"
          title="Validate repository configuration" v-on:click="resolveTemplate()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-check" aria-hidden="true"></span> Validate
        </button>
        
      </div>
    </div>

  </div><!-- row -->

  <div class="row">
    <div class="col-lg-12">  

      <div 
        v-if=" item.data.repo.template === null"
        class="alert alert-info" role="alert">
          No Repository Configuration defined for this server, <b><a href="#" v-on:click.stop.prevent="createRepoConfig">create one now !</a></b>
      </div>
      <div v-else>
        <h3>Configuration Template</h3>
        <hr/>      
        <inlineTextarea
          :initialValue="item.data.repo.template"
          :valid="validation.template"
          :allowEdit="!isReadOnly"
          inputType="pre"
          valueName="template"
          emptyValue="enter a template..."
          v-on:changeValue="changeTemplateValue">
        </inlineTextarea>
      </div>

    </div><!-- col-lg-12 -->

    <div v-if="templateCheck" class="col-lg-12" style="margin-top:1em;">  
      <h3>Configuration Validation Report</h3>
      <hr/>
      <div v-if="templateCheck.error">
        <div class="alert alert-danger" role="alert">
          <p style="margin-bottom: 1em;">
            <b>Failed to resolve the template</b> - see below for more information on the root cause of the error.<br/>
          </p>
          <pre>{{templateCheck.error.message}}</pre>
          <div v-if="templateCheck.error.parsererror">
            <div v-html="templateCheck.error.parsererror">
            </div>
          </div>
        </div>
        
      </div>
      <div v-else>
        <div class="alert alert-success" role="alert">
          <p style="margin-bottom: 1em;">
            <b>Congratulations</b> the XML configuration is well formed and entities have been resolved.<br/>
          </p>
          <pre>{{templateCheck.value}}</pre>
          
        </div>
      </div>
    </div>
  </div>

</div>
`;
