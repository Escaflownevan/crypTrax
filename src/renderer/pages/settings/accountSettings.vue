<template>
<div class="">
  <h1>Account Settings</h1>
  <div class="settingsHolder">
    <v-dialog v-model="showAddExchanges" width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">Add Exchange</v-btn>
      </template>
      <v-card class="cardPadding center">
        <div class="settingsHolderExtra">
          <h2>Import Exchange</h2>
          <span>For security set <strong class="text-decoration-underline">API Key</strong> restrictions to <strong class="text-decoration-underline">read only</strong>!</span>
          <p>crypTrax is not responsable for your keys!</p>
          <v-autocomplete v-model="inputSet" :items="exchanges" label="Exchange" item-text="name">
            <template v-slot:selection="{ item, index }">
              <img :src="item.logo" width="85" height="25">
              <span class="exchangeName">{{ item.name }}</span>
            </template>
            <template v-slot:item="{ item }">
              <img :src="item.logo" width="85" height="25">
              <span class="exchangeName">{{ item.name }}</span>
            </template>
          </v-autocomplete>
          <v-text-field label="API Key" v-model="apiKey"></v-text-field>
          <v-text-field label="API Secret" v-model="secret"></v-text-field>
          <v-text-field label="Password / Passphrase" v-model="password" placeholder="optional"></v-text-field>
          <v-btn @click="saveAPIKey" class="saveButton">Save API <i v-show="exchangeLoading" class="fas fa-spinner fa-pulse"></i><i v-show="exchangeSaved" class="fa fa-check-circle"></i></v-btn>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="showAddExchanges = false"> Close </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showAddWallets" width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">Add Wallet</v-btn>
      </template>
      <v-card class="cardPadding center">
        <div class="settingsHolderExtra">
          <h2>Import Wallet</h2>
          <span>Supported Wallets:</span>
          <p>Bitcoin, Ethereum
              <v-tooltip bottom content-class='custom-tooltip'>
                <template v-slot:activator="{ on }">
                    <i v-on="on" class="fa fa-info-circle" aria-hidden="true"></i>
                </template>
                <span>Update every 5 min * number of wallets to respekt call limit</span>
              </v-tooltip>
              , Litecoin, Dash, Dogecoin, Stratis, DigiByte, Neo </p>
          <v-text-field type="text" label="Wallet Address" v-model="newWallet"></v-text-field>
          <v-btn @click="addWallet" class="saveButton">Add Wallet <i v-show="walletLoading" class="fas fa-spinner fa-pulse"></i><i v-show="walletSaved" class="fa fa-check-circle"></i></v-btn>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="showAddWallets = false"> Close </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
  <div class="settingsHolderExtra">
    <h2>Imported Accounts</h2>
    <div v-if="imports.wallets.length != 0 || apiKeys.length != 0" class="importedAccounts">
      <div class="center">
        <v-card v-for="(item, index) in apiKeys" :key="index" class="accountsCards">
            <h3><img :src="exchanges.filter(el=>el.name == item.exchange).map(el=> el.logo)" height="25"/></h3>

          <div> apiKey: {{ hider(item.apiKey) }} </div>
          <v-btn small @click="delCoin('apiKey', item.exchange, item.apiKey)">Delete Exchange</v-btn>
        </v-card>
        <v-card v-for="(item, index2) in imports.wallets" :key="index2+10" class="accountsCards">
          <h3 class="colorSettings"><img :src="allCoins.filter(el=> el.symbol == item.walletType).map(el=>el.logo)" height="20"> {{item.walletType}} </h3>
          <div class=""> Adress: {{ item.walletAddress.replace(/(.{7})..+/, "$1&hellip;") }} </div>
          <v-btn small @click="delCoin('wallets', item.walletAdress)">Delete Wallet</v-btn>
        </v-card>
      </div>
    </div>
    <h4 class="center" v-else>Please import exchange or wallet</h4>
  </div>
  <div v-if="imports.wallets.length != 0 || apiKeys.length != 0" class="settingsHolderExtra">
    <h3 class="colorSettings">Imported Coins</h3>
    <div class="settingsHolder">
      <ul class="noListStyle">
        <h3 class="center colorSettings">Wallets</h3>
        <li v-for="(wallet, index) in imports.wallets" :key="index">
          <div class="infoHead">
            <img :src="allCoins.filter(el=> el.symbol == wallet.walletType).map(el=>el.logo)" height="20"> {{ wallet.walletType}}: {{ wallet.walletAddress.replace(/(.{7})..+/, "$1&hellip;")}}<br>
          </div>
          <table v-if="wallet.balances.length > 0" class="singleHoldingTable">
            <thead>
              <tr>
                <th>Coins / Tokens</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(balance, index2) in wallet.balances" :key="index2">
                <td>{{balance.coin}}</td>
                <td>{{balance.amount}}</td>
                <td>
                  <p v-if="$store.state.myCoins.some(el => el.symbol.toUpperCase() == balance.coin)">Already added</p>
                  <p v-if="!balance.listed">Not found</p>
                  <v-btn x-small v-if="!$store.state.myCoins.some(el => el.symbol.toUpperCase() == balance.coin) && balance.listed" @click="addMissingCoin(balance.coin)">Add</v-btn>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else>No Coins on wallet</p>
        </li>
      </ul>
    </div>
    <div class="settingsHolder">
      <ul class="noListStyle">
        <h3 class="center colorSettings">Exchanges</h3>
        <li v-for="(exchange, index) in imports.exchanges" :key="index">
          <div class="infoHead">
            <img :src="exchanges.filter(el=>el.name == exchange.exchange).map(el=> el.logo)" /> API Key: {{ exchange.apiKey.replace(/(.{7})..+/, "$1&hellip;")}}
          </div>
          <table v-if="exchange.balances.length > 0" class="singleHoldingTable">
            <thead>
              <tr>
                <th>Coins / Tokens</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(balance, index2) in exchange.balances" :key="index2">
                <td>{{balance.coin}}</td>
                <td>{{balance.amount}}</td>
                <td>
                  <p v-if="$store.state.myCoins.some(el => el.symbol.toUpperCase() == balance.coin)">Already added</p>
                  <v-btn x-small v-else @click="addMissingCoin(balance.coin)">Add</v-btn>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else>No Coins on exchange</p>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>


<script>
import mixin from '~/mixin/mixinGlobal.js';
import {
  getPortfolio
} from 'crypto-portfolio-viewer';
import balance from 'crypto-balances-2';
export default {
  name: 'AccountSettings',
  layout: 'settings',
  data() {
    return {
      newWallet: '',
      inputSet: '',
      apiKey: '',
      secret: '',
      password: '',
      exchanges: this.$store.state.exchangesList,
      showAddExchanges: false,
      showAddWallets: false,
      exchangeSaved: false,
      exchangeLoading: false,
      walletSaved: false,
      walletLoading: false
    }
  },
  methods: {
    hider(string) {
      return mixin.hider(string)
    },
    addMissingCoin(symbol) {
      this.$store.dispatch('pushMyCoins', [this.$store.state.allCoins.find(el => el.symbol == symbol).value])
      this.$store.dispatch('getmyCoinsListData');
    },
    includeInHoldings(type, apiOrWallet, coin, value) {
      this.$store.dispatch('setBalanceOption', {
        type: type,
        apiOrWallet: apiOrWallet,
        coin: coin,
        value: value
      });
    },
    loadWallets() {
      this.$store.dispatch('loadWalletsData')
    },
    addWallet() {
        this.walletLoading = true
        this.newWallet = this.newWallet.replace(/ /g,'')
        console.log("kjuihau")
      if (this.$store.state.accounts.wallets.indexOf(this.newWallet) > -1) {
        this.$dialog.error({
          text: '<br><h4 class="center">Wallet already added</h4>',
          title: 'Error'
        })
         this.walletLoading = false
        return
      }
      if (this.newWallet == '') {
        this.$dialog.error({
          text: '<br><h4 class="center">Please enter supported wallet</h4>',
          title: 'Error'
        })
         this.walletLoading = false
        return
      }
      if (this.$store.state.getAllCoinsCurrentLoop != this.$store.state.getAllCoinsMaxLoops) {
        this.$dialog.error({
          text: '<br><h4 class="center">Try again in a few seconds. Data is still being loaded</h4>',
          title: 'Error'
        })
         this.walletLoading = false
        return
      }
      let newWalletInput = this.newWallet
      balance(newWalletInput).then(result => {
        let data2 = {
          single: {
            walletType: result.address_type,
            walletAddress: newWalletInput,
            balances: []
          },
          addr: newWalletInput
        }
        if (Object.entries(result.balances).length != 0) {
          Object.entries(result.balances).forEach(([key, value]) => {
            data2.single.balances.push({
              coin: key,
              amount: value,
              price: 0,
              listed: mixin.checkGecko(this.$store.state.allCoins, key),
              include: mixin.checkGecko(this.$store.state.allCoins, key)
            })
          });
        }
        if (result.address_type != 'unknown') {
          this.$store.commit('saveNewWallet', data2);
          this.walletLoading = false
          this.walletSaved = true
          setTimeout(() => {
            this.walletSaved = false
          }, 2000)
        }
      }).catch(error => {
        this.$dialog.error({
          text: '<br><h4 class="center">Please enter supported wallet</h4>',
          title: 'Error'
        })
         this.walletLoading = false
      });
      this.newWallet = null
    },
    async saveAPIKey() {
        this.exchangeLoading = true
      if (Object.entries(this.$store.state.accounts.apiKeys).some(obj => obj[1].apiKey == mixin.crypt(this.apiKey))) {
        this.$dialog.error({
          text: '<br><h4 class="center">This API Key already added</h4>',
          title: 'Error'
        })
         this.exchangeLoading = false
        return
      }
      if (!this.inputSet || !this.apiKey || !this.secret) {
        this.$dialog.error({
          text: '<br><h4 class="center">Please fill all required fields: Exchange, API Key, API Secret</h4>',
          title: 'Error'
        })
         this.exchangeLoading = false
        return
      }
      let newKey = {
        exchange: this.inputSet,
        apiKey: this.apiKey,
        secret: this.secret,
        password: this.password
      }
      let keys = {
        [this.inputSet]: {
          apiKey: newKey.apiKey,
          secret: newKey.secret,
          password: newKey.password
        }
      }
      try {
        const portfolio = await getPortfolio({
          keys
        });
        if (portfolio) {
          let single = {
            exchange: newKey.exchange,
            apiKey: mixin.crypt(newKey.apiKey),
            balances: []
          }
          Object.values(portfolio[newKey.exchange]).forEach(value => {
            if (value[0] != "TOTAL") {
              single.balances.push({
                coin: value[0],
                amount: value[1].count,
                include: true,
                price: 0
              })
            }
          });
          let data2 = {
            single,
            newKey
          }
          newKey.apiKey = mixin.crypt(newKey.apiKey)
          newKey.secret = mixin.crypt(newKey.secret)
          newKey.password = mixin.crypt(newKey.password)
          this.$store.commit('setAccountAPIKeys', data2)
          this.exchangeLoading = false
          this.exchangeSaved = true
          setTimeout(() => {
            this.exchangeSaved = false
          }, 2000)
          this.inputSet = ''
          this.apiKey = ''
          this.secret = ''
          this.password = ''
        }
      } catch (e) {
        this.$dialog.error({
          text: '<br><h4 class="center">' + e + '</h4>',
          title: 'Error'
        })
      }
    },
    delCoin(name, data, apiKey) {
      this.$store.dispatch('delEntry', {
        type: name,
        data: data,
        apiKey: apiKey
      });
    },
    loadExchangeData() {
      this.$store.dispatch('loadExchangesData')
    }
  },
  computed: {
      allCoins(){
          return this.$store.state.allCoins
      },
    apiKeys() {
      return this.$store.state.accounts.apiKeys
    },
    imports() {
      return this.$store.state.accounts.imports
    }
  }
}
</script>


<style scoped>
h4 {
  margin-top: 20px;
}

.cardPadding {
  padding: 10px;
}

.apiKeyList li {
  margin: 20px 0
}

.walletBalances {
  margin: 6px 0
}

.left {
  float: left;
  width: 50%;
}

.right {
  float: right;
  width: 50%;
}

.saveButton {
  margin-bottom: 10px;
}

.noListStyle {
  list-style: none;
  width: 100%;
}

.accountsCards {
  width: 31.5%;
  padding: 10px;
  margin: 4px;
}

.accountsCards>div {
  margin: 5px 0px;
}
.accountsCards h3{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
}
.colorSettings{
    color: var(--textColorSettings);
}
.importedAccounts>div {
  margin-top: 10px;
  display: inline-flex;
  flex-wrap: wrap;
  width: -webkit-fill-available;
}

.singleHoldingTable th,
.singleHoldingTable td {
  white-space: unset
}

.infoHead {
  margin-top: 25px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.exchangeName {
  text-transform: capitalize;
  margin-left: 5px;
}

.fa-check-circle, .fa-info-circle, .fa-spinner {
  font-size: 18px;
}
</style>
