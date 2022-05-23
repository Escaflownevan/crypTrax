<template>
<div>
  <v-data-table id="myCoinsList" :headers="view" headers.align="center" :items="myCoins" :single-expand="true" item-key="id" show-expand :expanded.sync="expanded" :hide-default-footer="true" disable-pagination>
    <template v-slot:item="{ item, index, expand, isExpanded }">
      <tr class="mainRow" :class="{'hasChildRow': isExpanded}">
          <td v-if="item.rank != 0" :class="{displayNone: !viewAll[2].view}">{{ item.rank }}</td>
          <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td v-if="item.logo_url.length != 0" class="logoCol" :class="{displayNone: !viewAll[0].view}"><img :title="item.name" :src="'' + item.logo_url" height="30" /></td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td v-if="item.symbol.length != 0" class="coinName" :class="{displayNone: !viewAll[1].view}"><a :title="item.name+' open on Tradingview.com'" target="_blank" :href="'https://www.tradingview.com/chart/?symbol=' + item.symbol + 'USD&theme='+style+'&interval=30'">
            {{ item.name }}</a> <a v-show="cgLogo" class="coingecko-icon" :title="item.name+' open on Coingeko.com'" target="_blank" :href="'https://www.coingecko.com/en/coins/'+item.id"><img :src="require(`../assets/gecko.webp`)" height="20"
                width="20" /></a></td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td v-if="item.price != null" :class="{displayNone: !viewAll[3].view}">{{isNaN(item.price) ? item.price : callTwoDecimals(item.price)}} <span v-show="item.price != 'N/A'">{{ fiat }}</span></td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td v-if="item.time1h != null" :class="[{displayNone: !viewAll[4].view}, colorCheck(item.time1h)]">{{item.time1h}} <span v-show="item.time1h != 'N/A'">%</span></td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td v-if="item.time1d != null" :class="[{displayNone: !viewAll[5].view}, colorCheck(item.time1d)]">{{item.time1d}} <span v-show="item.time1d != 'N/A'">%</span></td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td v-if="item.time7d != null" :class="[{displayNone: !viewAll[6].view}, colorCheck(item.time7d)]">{{item.time7d}} <span v-show="item.time7d != 'N/A'">%</span></td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td v-if="item.btc_price != 0" :class="{displayNone: !viewAll[7].view}">{{isNaN(item.btc_price) ? 0 : callTwoDecimals(item.btc_price)}} BTC</td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td v-if="item.market_cap != null" :class="{displayNone: !viewAll[8].view}">{{item.market_cap == 'N/A' ? item.market_cap : capFormated(item.market_cap)}} <span v-show="item.market_cap != 'N/A' && capFormated(item.market_cap) != 'N/A'">{{ fiat }}</span></td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td :class="[{displayNone: !viewAll[9].view}, colorCheck(item.total)]">{{isNaN(item.total) ? 'N/A' : item.total}} <span v-show="!isNaN(item.total)">{{ fiat }}</span></td>
        <td :class="[{displayNone: !viewAll[10].view}, colorCheck(item.profitLoss)]">{{isNaN(item.profitLoss) ? 'N/A' : item.profitLoss}} <span v-show="!isNaN(item.profitLoss)">{{ fiat }}</span></td>
        <td v-if="item.high != 0" :class="{displayNone: !viewAll[11].view}">
          <v-tooltip bottom content-class='custom-tooltip'>
            <template v-slot:activator="{ on }">
              <div v-on="on">
                {{isNaN(item.high) ? item.high : callTwoDecimals(item.high) }} <span v-show="!isNaN(item.high)">{{ fiat }}</span>
              </div>
            </template>
            <div>
              <div>Difference: {{ item.high_change_percentage.toFixed(2) }} %</div>
              <div>ATH @ {{ item.high_date }}</div>
            </div>
          </v-tooltip>
        </td>
        <td v-else><i class="fas fa-spinner fa-pulse"></i></td>
        <td :class="{displayNone: !viewAll[12].view}">
          <apexchart type="area" width="120" height="40" :options="chartOptions" :series="singleSeries( item.name, index )" class="daysGraph"></apexchart>
        </td>
        <td>
          <i v-show="!isExpanded" class="fas fa-chevron-down" @click="expand(!isExpanded)"></i>
          <i v-show="isExpanded" class="fas fa-chevron-up closeExpand" @click="expand(!isExpanded)"></i>
        </td>
      </tr>
    </template>
    <template v-slot:expanded-item="{ headers, item, index }">
      <tr class="v-data-table__expanded">
        <td :colspan="headers.length" :draggable="false">
          <div class="quickSettingsCard">
            <h3>Purchases</h3>
            <singleHolding :element="item" />
          </div>
          <div class="quickSettingsCard alerts">
            <h3>Alerts</h3>
            <singleAlert :element="item" />
          </div>
          <div class="quickSettingsCard delete">
            <h3>Options</h3>
            <v-btn @click="delCoin(index)">Delete Coin</v-btn>
            <v-btn small @click="checkDeleteAll=true">Delete All Coins</v-btn>
          </div>
        </td>
      </tr>
    </template>
    <template v-slot:no-data>
      <div class="center">
        <h1>Please add currencies<br><i @click="go()" class="fas fa-plus-circle"></i></h1>
      </div>
    </template>
  </v-data-table>
  <v-dialog v-model="checkDeleteAll" width="500">
    <v-card>
      <h1>Are you sure delete all Coins?</h1>
      <div class="center deleteConfirm">
        <v-btn @click="delAllCoin">Yes</v-btn>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="checkDeleteAll = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import apexchart from "vue-apexcharts";
import mixin from '~/mixin/mixinGlobal.js';
import singleHolding from '~/components/singleHolding.vue';
import singleAlert from '~/components/singleAlert.vue';
import Sortable from 'sortablejs';
export default {
  name: 'coinsList',
  components: {
    apexchart,
    singleAlert,
    singleHolding
  },
  data() {
    return {
      sort: null,
      pickedDate: null,
      modelValue: null,
      checkDeleteAll: false,
      expanded: [],
      viewAll: this.$store.state.settings.view,
      chartOptions: {
        chart: {
          type: 'area',
          height: 80,
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          },
          animations: {
            enabled: false
          }
        },
        colors: ['#ce571d'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        grid: {
          show: false
        },
        xaxis: {
          type: 'category',
          labels: {
            show: false
          },
          tooltip: {
            enabled: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          show: false
        },
        tooltip: {
          theme: this.$store.state.settings.darkModeOn ? 'dark' : 'light',
          fixed: {
            enabled: true,
            position: 'left',
            offsetX: -170,
            offsetY: -25,
          },
          x: {
            formatter: function(value) {
              return new Date(new Date().setDate(new Date().getDate() - (31 - value))).toISOString().split('T')[0]
            }
          }
        }
      }
    }
  },
  methods: {
    theFormat(number) {
      return this.callTwoDecimals(number)
    },
    go() {
      document.querySelector(".showQuickAddCoins").click()
    },
    callTwoDecimals(item) {
      return mixin.twoDecimals(item)
    },
    capFormated(cap) {
      return mixin.bigMoneyName(cap)
    },
    delAllCoin() {
      this.$store.commit('delAllCoin')
      this.checkDeleteAll = false
      this.expanded = []
    },
    delCoin(index) {
      this.$store.dispatch('delEntry', {
        index: index,
        type: 'myCoins'
      });
    },
    singleSeries(name, index) {
      let days30Prices = this.$store.state.myCoins[index].days30.prices
      if (days30Prices.length < 31) {
        let length = 31 - days30Prices.length
        for (var i = 0; i < length; i++) {
          days30Prices = [0, ...days30Prices]
        }
      }
      let data = [{
        name: name,
        data: days30Prices.slice(-31)
      }]
      return data
    },
    colorCheck(number) {
      return {
        green: number > 0,
        red: number < 0
      }
    },
    cutter(oldIndex, newIndex) {
      let dragNdrop = [...this.myCoins];
      const element = dragNdrop.splice(oldIndex, 1)[0];
      dragNdrop.splice(newIndex, 0, element);
      this.myCoins = dragNdrop
      this.$parent.updateTable()
    },
    sortListener() {
      let table = document.querySelector("tbody");
      if (this.sort) { //listener already set
        this.sort.destroy()
        this.sort = null
      }
      const _self = this
      this.sort = Sortable.create(table, {
        draggable: ".mainRow",
        indexOpen: null,
        onStart: function() {
          document.querySelectorAll(".mainRow").forEach((item, i) => {
            if (item.classList.contains("hasChildRow")) {
              this.indexOpen = i
            }
          });
        },
        onEnd({
          newIndex,
          oldIndex
        }) {
          if (this.indexOpen < oldIndex) {
            this.indexOpen = null
            _self.cutter(oldIndex - 1, newIndex)
          } else if (this.indexOpen > oldIndex || (this.indexOpen == oldIndex && oldIndex < newIndex)) {
            this.indexOpen = null
            _self.cutter(oldIndex, newIndex - 1)
          } else {
            this.indexOpen = null
            _self.cutter(oldIndex, newIndex)
          }
        }
      });
    },
    checkAlert() {
      this.$store.state.myCoins.forEach((item, coinIndex) => {
        item.alerts.forEach((alert, alertIndex) => {
          if (alert.active) {
            if ((alert.directionBigger && item.price >= alert.price) || (!alert.directionBigger && item.price <= alert.price)) {
              this.$dialog.info({
                text: '<br><h4 class="center textColorSettings"><img style="display:block; margin: 0 auto;" src="' + item.logo_url + '" height="50" />' + item.name + ' has reached: ' + item.price + ' ' + this.fiat + '</h4><br><p class="center textColorSettings">This alert is deactivated</p>',
                title: 'Alert on ' + item.name
              })
              this.$store.commit('deactivateAlert', {
                coinIndex: coinIndex,
                alertIndex: alertIndex
              });
            }
          }
        });
      });
    }
  },
  watch: {
    myCoins(newValue, oldValue) {
      this.myCoinsOld = oldValue
    }
  },
  computed: {
    myCoins: {
      get() {
        return this.$store.state.myCoins
      },
      set(value) {
        this.$store.dispatch('updateMyCoins', JSON.stringify(value))
      }
    },
    style(){
        if (this.$store.state.settings.darkModeOn) {
            return 'dark'
        }else{
            return 'light'
        }
    },
    triggerCheckAlerts() {
      return this.$store.state.triggerCheckAlerts
    },
    view() {
      return this.$store.state.settings.view.filter(el => el.view)
    },
    fiat() {
      return this.$store.state.settings.fiat.symbol
    },
    cgLogo() {
      return this.$store.state.settings.cgLogo
    },
    btcPrice() {
      return this.$store.state.btcPrice
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
  },
  watch: {
    triggerCheckAlerts() {
      setTimeout(() => {
        this.checkAlert();
      }, 1000)
    },
    myCoins() {
      this.sortListener();
    }
  },
  mounted() {
    this.sortListener();
    this.checkAlert();
  }
}
</script>

<style lang="scss" >
.center i {
    font-size: 50px;
    margin: 20px 0;
}
.v-data-table__expanded:hover {
    background: #ababab!important;
}
.v-data-table__expanded {
    background-color: #ababab;
}
.v-data-table__expanded > td {
    text-align: center;
}
.quickSettingsCard {
    display: inline-flex;
    max-width: 400px;
    margin: 10px;
    padding: 5px 5px 0;
    flex-direction: column;
    background-color: #383838;
    border-radius: 10px;
}
.quickSettingsCard:nth-child(2) {
    background-color: #393939;
}
.quickSettingsCard:last-child {
    background-color: #404040;
}
.green {
    color: #359435!important;
}
.red {
    color: #d03b3b!important;
}
.theme--light.v-data-table {
    background-color: unset!important;
}
.v-data-table-header__icon {
    position: absolute!important;
}
#myCoinsList {
    border: solid black 0.5px;
    border-radius: 15px;
    box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.75);
    margin: 0 20px 10px;
    overflow: hidden;
    -webkit-user-select: none;
    .mainRow td,
    th {
        color: var(--listTextColor);
        padding: 0px 4px!important;
        text-align: center;
        white-space: nowrap;
        font-size: 15px;
    }
    th i {
        color: var(--primaryColor);
    }
    .mainRow {
        &:nth-child(2n+1) {
            background-color: var(--listBGR1);
        }

        &:nth-child(2n) {
            background-color: var(--listBGR2);
        }
    }

    .coinName a:first-child {
        color: var(--listTextColor);

    }

    th {
        background-color: var(--coinListHead);
        border-bottom: solid 0.5px black;
    }

}

.v-data-table-header th:first-child {
    display: none;
}
.coingecko-icon img {
    position: relative;
    top: 5px;
}
.logoCol img {
    vertical-align: middle;
}
.quickSettingsCard.alerts h3,
.quickSettingsCard.delete h3 {
    margin-bottom: 21px;
}
.daysGraph > div {
    margin: 0 auto;
}
.deleteConfirm {
    padding: 10px 0;
}
.deleteConfirm button,
.quickSettingsCard.delete button {
    margin: 0 auto;
    width: 200px;
    margin-bottom: 5px;
}
.textColorSettings{
    color: var(--textColorSettings);
}
</style>
