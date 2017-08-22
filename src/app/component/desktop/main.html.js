module.exports = `
<div class="row">
  <div class="col-lg-12">
    <h1>Desktop</h1>
    <hr/>
    <div class="well">
      <p>{{message}}</p>
      <p>{{ name }}</p>
      <input v-model="name" placeholder="enter your name">
      <hr/>
      <ol>
        <li v-for="(todo, index)  in todos">
          {{ todo.text }} (index = {{index}})
        </li>
      </ol>
    </div>
  </div>
</div>
`;
