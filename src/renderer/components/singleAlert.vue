<template>
<div>
  <table class="singleHoldingTable">
    <thead>
      <tr>
        <th>Price</th>
        <th>Active</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in element.alerts" :key="index">
        <td><v-text-field @change="savePurchasesAlerts(element.id,'alerts', 'price', index, $event)" type="number" :value="item.price" /></td>
        <td>
          <label class="switch">
            <input type="checkbox" @change="savePurchasesAlerts(element.id,'alerts', 'active', index, $event.target.checked)" :checked="item.active">
            <span class="slider round"></span>
          </label>
        </td>
        <td>
          <img @click="delPurchaseAlerts(element.id, index, 'alerts')" :src="require(`~/assets/svg/delete.svg`)" height="20" width="20" />
        </td>
      </tr>
    </tbody>
  </table>
  <div class="buttonsMargin">
    <v-btn small @click="addAlert(elementIndex)">Add</v-btn>
  </div>
  <v-dialog v-model="showError" width="600">
    <v-card>
      <h1>Error</h1>
      <h3 class="textColorSettings">Alert price is same as actual price. Must be more or less</h3>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showError = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>


<script>
export default {
  name: 'singleAlert',
  props: ['element'],
  data() {
    return {
      showError: false
    }
  },
  mounted() {},
  methods: {
    addAlert(index) {
      this.$store.dispatch('addAlert', {
        index: index
      });
    },
    savePurchasesAlerts(coin, type, valueType, index, data) {
        if(data == '') data = 0
      if (this.$store.state.myCoins.filter(el => el.id == coin)[0].price == data) {
        this.showError = true
        return
      }
      this.$store.dispatch('updateMyCoinsSingle', {
        id: coin,
        type: type,
        valueType: valueType,
        index: index,
        data: data
      });
    },
    delPurchaseAlerts(id, index, type) {
      this.$store.dispatch('delPurchaseAlerts', {
        id: id,
        index: index,
        type: type
      });
      if (this.myCoins.filter(el => el.id == id)[0].alerts.length == 0) {
        this.addAlert(index)
      }
    }
  },
  computed: {
    myCoins() {
      return this.$store.state.myCoins
    },
    elementIndex() {
      return this.myCoins.findIndex(el => el.id == this.element.id)
    }
  }
}
</script>


<style scoped>

</style>
