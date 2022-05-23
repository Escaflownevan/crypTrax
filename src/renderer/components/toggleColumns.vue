<template>
<div class="componentHolder">
  <div class="settingsItem">
    <h1>Hide Columns</h1>
    <ul>
      <li v-for="(item, index) in allColumns" :key="item.name">
        <label v-if="item.text != ''" class="switch">
          <input class="hideCol" type="checkbox" :checked="item.view" @change="changeView(index, $event.target.checked)">
          <span class="slider round"></span>
        </label>
        <p> {{ item.text }}</p>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'toggleColumns',
  data() {
    return {}
  },
  computed: {
    allColumns() {
      return this.$store.state.settings.view.filter(el => el.text != "")
    }
  },
  methods: {
    changeView(index, data) {
      this.$store.dispatch('updateToggleColumns', {
        index: index,
        value: data
      })
    }
  }
}
</script>

<style lang="css" scoped>
h1{
    margin-bottom: 30px;
}
ul{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 310px;
    padding: 0px 10px;
}
li{
    list-style: none;
    background-color: var(--listBGR1);
    padding: 10px 10px;

}
li:nth-child(2n+1){
    background-color: var(--listBGR2);
}
label{
    float: right;

}
p{
    display: table-cell;
    margin-bottom: 0;
    color: var(--textColorSettings);
    height: 24px;
    vertical-align: middle;
}
</style>
