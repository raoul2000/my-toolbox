module.exports = `
<li>
  <div
    :class="{bold: isFolder}"
    @click="toggle"
    @dblclick="changeType">
    {{model.name}}
    <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
  </div>
  <ul v-show="open" v-if="isFolder">
    <item
      class="item"
      v-for="model in model.children"
      :key="model.id"
      :model="model">
    </item>
    <li class="add" @click="addChild">+</li>
  </ul>
</li>
`;
