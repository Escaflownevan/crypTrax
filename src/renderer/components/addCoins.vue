<template>
<div class="allAddCoin">
  <div class="settingsHolder single">
    <h2>Select Cryptocurrency</h2>
    <v-autocomplete v-model="selectedCoins" :items="allCoins" multiple item-text="name" :label="label" :loading="isLoading" deletable-chips small-chips class="allCoinsSelect">
      <template v-slot:item="{ item }">
        <img v-if="item.logo" :src="item.logo" width="20" height="20" class="addCoinLogo">
        <span> {{ item.name }}</span>
      </template>
    </v-autocomplete>
    <v-btn @click="saveSelectedCoins">Add Coins</v-btn>
  </div>
  <div class="settingsHolder single quick">
    <h2>Quick Add</h2>
    <v-btn-toggle class="center quickTop">
      <v-btn @click="addTop(3)" :disabled="isLoading"> Top 3 </v-btn>
      <v-btn @click="addTop(5)" :disabled="isLoading"> Top 5 </v-btn>
      <v-btn @click="addTop(10)" :disabled="isLoading"> Top 10 </v-btn>
    </v-btn-toggle>
  </div>
  <v-dialog v-model="showError" width="600">
    <v-card>
      <h1>Error</h1>
      <h3>Too many coins {{this.countSelected}} / 40 </h3>
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
  name: 'addCoins',
  data() {
    return {
      selectedCoins: [],
      label: 'Cryptocurrencies',
      showError: false,
      countSelected: 0
    }
  },
  methods: {
    delSelectedItem(index) {
      this.selectedCoins.splice(index, 1)
    },
    addTop(val) {
      if (this.myCoins.length + val >= 40) {
        this.countSelected = this.myCoins.length + val
        this.showError = true
        return
      }
      this.selectedCoins = this.$store.state.allCoins.filter((coin, index) => !this.$store.state.myCoins.some(el => el.id == coin.value) && index < val).map(el => el.value)
      this.saveSelectedCoins()
    },
    saveSelectedCoins() {
      if (this.myCoins.length + this.selectedCoins.length - 1 >= 40) {
        this.countSelected = this.myCoins.length + this.selectedCoins.length - 1
        this.showError = true
        return
      }
      this.$store.dispatch('pushMyCoins', this.selectedCoins);
      this.$store.dispatch('getmyCoinsListData');
      this.selectedCoins = [];
    }
  },
  computed: {
    myCoins() {
      return this.$store.state.myCoins
    },
    allCoins() {
      return this.$store.state.allCoins.filter(e => this.myCoins.map(el => el.symbol.toUpperCase()).indexOf(e.symbol) == -1)
    },
    isLoading() {
      if (this.$store.state.getAllCoinsCurrentLoop != this.$store.state.getAllCoinsMaxLoops) {
        this.label = 'Loading... ' + Number(((this.$store.state.getAllCoinsCurrentLoop / this.$store.state.getAllCoinsMaxLoops) * 100)).toFixed(0) + ' %'
      } else {
        this.label = 'Cryptocurrencies'
      }
      return this.$store.state.getAllCoinsCurrentLoop != this.$store.state.getAllCoinsMaxLoops
    }
  }
}
</script>


<style scoped>
.coinSelected {
  background-color: #555;
  padding: 4px 8px;
  border-radius: 15px;
  margin: 2px;
  display: flex;
  align-items: center;
}

.coinSelected span {
  margin-left: 2px;
}

.allAddCoin {
  text-align: center;
  width: 100%;
}

.quick {
  margin-top: 40px;
  margin-bottom: 20px;
}

.quick h2 {
  margin-bottom: 10px;
}

.allCoinsSelect {
  width: 100%;
}

.quickTop {
  border-radius: 15px;
}

.quickTop button:first-child {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.quickTop button:last-child {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}
.addCoinLogo{
    margin-right: 5px;
}
</style>
