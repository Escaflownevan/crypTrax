<template>
<div>
  <h1>Manage Holdings</h1>
  <div class="settingsHolderExtra listHolder">
    <h2>Your Coins</h2>
    <ul v-for="item in myCoins" :key="item.id" class="settingsHolder single customBGR">
      <span class="titleHoldings">
        <img :src="item.logo_url" height="20"> {{ item.name }}
      </span>
      <li>
        <singleHolding :element="item" />
      </li>
    </ul>
  </div>
</div>
</template>


<script>
import singleHolding from '~/components/singleHolding.vue';
export default {
  name: 'ManageHoldings',
  components: {
    singleHolding
  },
  layout: 'settings',
  data() {
    return {
      pickedDate: null,
    }
  },
  methods: {
    triggerHistorySearch(id, index) {
      this.$store.dispatch('loadHistoryDate', {
        id: id,
        date: new Date(this.pickedDate).toLocaleDateString().split(".").join("-"),
        index: index
      })
    },
    delPurchaseAlerts(id, index, type) {
      this.$store.dispatch('delPurchaseAlerts', {
        id: id,
        index: index,
        type: type
      });
    },
    addPurchases(index) {
      this.$store.dispatch('addPurchases', {
        index: index
      });
    },
  },
  computed: {
    myCoins() {
      return this.$store.state.myCoins
    }
  }
}
</script>


<style scoped>
.listHolder {
  flex-direction: column;
  align-items: unset;
}

.listHolder li {
  list-style: none;
}

.titleHoldings {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.titleHoldings img {
  margin-right: 4px;
}

.datepickerTd {
  text-align: center;
}
.customBGR{
    background-color: var(--settingsBGR)
}
</style>
