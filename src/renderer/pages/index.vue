<template>
<div>
  <div class="quickMenu">
    <v-dialog v-model="showQuickAddCoins" width="600">
      <template v-slot:activator="{ on, attrs }">
        <i v-bind="attrs" v-on="on" class="fas fa-plus-circle showQuickAddCoins"></i>
      </template>
      <v-card>
        <h1>Add Coins</h1>
        <addCoins />
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showQuickAddCoins = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showQuickToggleColumns" width="600">
      <template v-slot:activator="{ on, attrs }">
        <i v-bind="attrs" v-on="on" class="fas fa-columns"></i>
      </template>
      <v-card>
        <toggleColumns />
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showQuickToggleColumns = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-if="infoPanel" id="globalAndHoldings">
    <div>
      <h4>Global</h4>
      <p>{{ globalMarketCap }} {{ fiat }}</p>
    </div>
    <div>
      <h4>Total</h4>
      <p :class="colorCheck(total)">{{ total }} {{ fiat }}</p>
    </div>
    <div>
      <h4>Profit Loss</h4>
      <p :class="colorCheck(profitLoss)">{{ profitLoss }} {{ fiat }}</p>
    </div>
  </div>
  <div>
    <coinList :key="rerender" />
  </div>
</div>
</template>

<script>

import coinList from "~/components/coinList.vue";
import addCoins from '~/components/addCoins.vue';
import toggleColumns from '~/components/toggleColumns.vue';
export default {
  name: 'index',
  components: {
    coinList,
    addCoins,
    toggleColumns
  },
  data() {
    return {
      showQuickAddCoins: false,
      showQuickToggleColumns: false,
      rerender: 0
    }
  },
  methods: {
    colorCheck(number) {
      return {
        green: number > 0,
        red: number < 0
      }
    },
    updateTable() {
      this.rerender++
    }
  },
  computed: {
    fiat() {
      return this.$store.state.settings.fiat.symbol
    },
    globalMarketCap() {
      return this.$store.state.globalMarketCap
    },
    total() {
      return this.$store.state.total
    },
    profitLoss() {
      return this.$store.state.profitLoss
    },
    infoPanel() {
      return this.$store.state.settings.infoPanel
    }
  }
}
</script>

<style lang="css" scoped>


#globalAndHoldings {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
}
#globalAndHoldings h4{
    color: var(--infoBarTitleColor);
}
#globalAndHoldings div {
    margin: 10px 20px;
    text-align: center;

}

#globalAndHoldings p {
    color: var(--infoBarValueColor);
}

.quickMenu{
    position: absolute;
}
</style>
