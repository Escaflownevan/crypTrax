<template>
<div class="allHoldings">
  <div class="holding">
    <h4>Add manually</h4>
    <table class="singleHoldingTable">
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Price@Buy</th>
          <th>Price Finder</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(purchases, index) in element.purchases" :key="index">
          <td class="amount">
            <v-text-field @input="savePurchasesAlerts(element.id,'purchases', 'amount', index, $event !== '' ? $event : 0)" type="number" :value="purchases.amount" />
          </td>
          <td class="boughtPrice">
            <v-text-field @input="savePurchasesAlerts(element.id,'purchases', 'price', index, $event !== '' ? $event : 0)" type="number" :value="purchases.price" />
          </td>
          <td v-if="apiCallsCounter + 1 < apiLimit" class="datepickerTd"><i class="fas fa-search" @click="menu2=!menu2"></i>
            <v-date-picker v-show="menu2" v-model="pickedDate" :max="new Date().toISOString().slice(0,10)" @input="triggerHistorySearch(element.id, index)" no-title class="pickerPosi"></v-date-picker>
          </td>
          <td v-else>
            <p>wait 1 min, call limit</p>
          </td>
          <td>
            <img @click="delPurchaseAlerts(element.id, index, 'purchases')" :src="require(`~/assets/svg/delete.svg`)" height="20" width="20" class="deleteEntry" />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttonsMargin">
      <v-btn small @click="addPurchases(index())">Add</v-btn>
    </div>
  </div>
  <div v-for="(wallet, index2) in checkWalletBalances()" :key="index2+30" class="holding">
    <div v-for="(balance, index3) in filterWalletBalances(wallet)" :key="index3+60">
      <h4 class="sameHeight">Wallet: {{ wallet.walletAddress.replace(/(.{7})..+/, "$1&hellip;") }}</h4>
      <table class="singleHoldingTable externalInput">
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Price@Buy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="amount">{{balance.amount}}</td>
            <td class="boughtPrice">
              <v-text-field @input="saveBalanceBuyPrice('walletAdress-price', wallet.walletAddress,balance.coin, $event !== '' ? $event : 0)" type="number" :value="balance.price" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-for="(exchange, index4) in checkExchangeBalances()" :key="index4+90" class="holding">
    <h4 class="sameHeight"><img :src="exchanges.filter(el=>el.name == exchange.exchange).map(el=> el.logo)" height="20" /> {{hider(exchange.apiKey)}}</h4>
    <table class="singleHoldingTable externalInput">
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Price@Buy</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="amount">{{filterExchangeBalances(exchange).amount}}</td>
          <td class="boughtPrice">
            <v-text-field @input="saveBalanceBuyPrice('apiKey-price', exchange.apiKey,filterExchangeBalances(exchange).coin, $event !== '' ? $event : 0)" type="number" :value="filterExchangeBalances(exchange).price" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>


<script>
import mixin from '~/mixin/mixinGlobal.js'
import dateFormat from 'dateformat';
export default {
  name: 'singleHolding',
  props: ['element'],
  data() {
    return {
      pickedDate: null,
      apiLimit: this.$store.state.apiLimitCheck.apiCallsLimit,
      menu: false,
      menu2: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      exchanges: this.$store.state.exchangesList,
      allCoins: this.$store.state.allCoins
    }
  },
  methods: {
    hider(string) {
      return mixin.decrypt(string).replace(/(.{7})..+/, "$1...")
    },
    savePurchasesAlerts(coin, type, valueType, index, data) {
      this.$store.dispatch('updateMyCoinsSingle', {
        id: coin,
        type: type,
        valueType: valueType,
        index: index,
        data: data
      });
    },
    saveBalanceBuyPrice(type, apiOrWallet, coin, value) {
      this.$store.dispatch('setBalanceOption', {
        type: type,
        apiOrWallet: apiOrWallet,
        coin: coin,
        value: value
      })
    },
    triggerHistorySearch(id, index) {
      this.$store.dispatch('loadHistoryDate', {
        id: id,
        date: dateFormat(new Date(this.pickedDate), "dd-mm-yyyy"),
        index: index
      })
      this.menu2 = false
    },
    delPurchaseAlerts(id, index, type) {
      this.$store.dispatch('delPurchaseAlerts', {
        id: id,
        index: index,
        type: type
      });
      if (type == 'purchases') {
        if (this.element.purchases.length == 0) {
          this.addPurchases(this.index())
        }
      }
    },
    addPurchases(index) {
      this.$store.dispatch('addPurchases', {
        index: index
      });
    },
    index() {
      let res
      this.myCoins.forEach((item, i) => {
        if (item.id == this.element.id) {
          res = i
        }
      });
      return res
    },
    filterWalletBalances(wallet) {
      return wallet.balances.filter(item => item.coin == this.element.symbol.toUpperCase())
    },
    checkWalletBalances() {
      return this.imports.wallets.filter(el => el.balances.find(item => item.coin == this.element.symbol.toUpperCase() && item.include))
    },
    filterExchangeBalances(exchange) {
      return exchange.balances.filter(item => item.coin == this.element.symbol.toUpperCase())[0]
    },
    checkExchangeBalances() {
      return this.imports.exchanges.filter(el => el.balances.find(item => item.coin == this.element.symbol.toUpperCase() && item.include))
    }
  },
  computed: {
    myCoins() {
      return this.$store.state.myCoins
    },
    imports() {
      return this.$store.state.accounts.imports
    },
    apiCallsCounter() {
      return this.$store.state.apiLimitCheck.apiCallsCounter
    }
  }
}
</script>


<style >
.datepickerTd {
  text-align: center;
}

.allHoldings {
  text-align: left;
}

.buttonsMargin {
  margin-top: 10px;
  margin-bottom: 20px;
}

.deleteEntry:hover {
  cursor: pointer;
  transform: scale(1.1)
}

.pickerPosi {
  position: absolute;
  margin-left: -175px;
  margin-top: 20px;
  z-index: 10;
}

.holding {
  margin-bottom: 10px;
}

.sameHeight {
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 5px;
}
.externalInput tbody td{
    width: 50%
}
</style>
