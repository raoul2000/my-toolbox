module.exports = `
<div  v-if="item != null ">
  <div class="row">
    <div class="col-lg-12">

      <div class="btn-group btn-group-sm secondary-toolbar" role="group" >
        <button title="Add Tomcat" v-on:click="addTomcat()" type="button" class="btn btn-default btn-xs">
          <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Tomcat
        </button>
      </div>

      <div v-for="tomcat in item.data.tomcats"  :key="tomcat._id">
        <tomcat
          :item="item"
          :tomcat="tomcat"/>
      </div>

    </div>
  </div>
</div>
`;
