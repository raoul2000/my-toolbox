module.exports = `
<div>
  <h2>Scan For Web Applications</h2>
  <p>
    I have found {{ task.tomcats.length}} Tomcat instance(s) on this server.
    Please select the ones you want to scan:
  </p>

  <div
    v-for="(tomcat, index) in task.tomcats"
    :key="index">

    <label>
      <input
        type="checkbox"
        :value="tomcat.id"
        v-on:click="toggleTomcatSelection(tomcat.id)"
        :checked="tomcat.selected"/>

        Tomcat <b>{{tomcat.id}}</b>
    </label>
  </div>
</div>
`;
