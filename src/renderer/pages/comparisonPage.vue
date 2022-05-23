<template>
<div>
  <div class="filterMenu center">
    <v-tooltip bottom content-class='custom-tooltip'>
      <template v-slot:activator="{ on }">
        <h3>Filter Menu</h3> <i v-on="on" class="fa fa-info-circle"></i>
      </template>
      <p class="center">- To show data, Coin(s) must be in List</p>
      <span class="center">- ROI can only calculated if Price@Buy is set</span>
    </v-tooltip>
    <div class="sektion">
      <h4>Types</h4>
      <v-btn-toggle>
        <v-btn small @click="calcPercentageAll('all')" class="v-btn--active">All</v-btn>
        <v-btn small @click="calcPercentageAll('manually')">Manually</v-btn>
        <v-btn small @click="calcPercentageAll('wallets')">Wallets</v-btn>
        <v-btn small @click="calcPercentageAll('exchanges')">Exchanges</v-btn>
      </v-btn-toggle>
    </div>
    <div class="sektion">
      <h4 v-show="allWallets.length>0">Wallet(s)</h4>
      <v-btn-toggle>
        <v-btn small v-for="(item, index) in allWallets" @click="calcPercentageAll('walletSingle', item)" :key="index">{{item.replace(/(.{7})..+/, "$1...")}}</v-btn>
      </v-btn-toggle>
    </div>
    <div class="sektion">
      <h4 v-show="allExchanges.length>0">Exchange(s)</h4>
      <v-btn-toggle>
        <v-btn small v-for="(item, index) in allExchanges" @click="calcPercentageAll('exchangeSingle', item.apiKey)" :key="index+1"><img :src="item.logo" height="25"/>{{ hider(item.apiKey) }}</v-btn>
      </v-btn-toggle>
    </div>
  </div>
  <div class="chartHolder">
    <apexchart :options="optionsTotal" :series="optionsTotal.series"></apexchart>
    <apexchart :options="optionsPL" :series="optionsPL.series"></apexchart>
    <apexchart :options="optionsROI" :series="optionsROI.series"></apexchart>
  </div>
</div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import mixin from '~/mixin/mixinGlobal.js';
export default {
  name: 'comparisonPage',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      fiat: this.$store.state.settings.fiat.symbol,
      lastFilter: null,
      singleLastFilter: null,
      optionsTotal: {
        series: [],
        chart: {
          type: 'donut',
          id: 'apex-chart-total',
          width: '100%'
        },
        noData: {
          text: 'No data with this filter',
          align: 'center',
          verticalAlign: 'top',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: getComputedStyle(document.body).getPropertyValue('--textColorSettings'),
            fontSize: '30px'
          }
        },
        labels: [],
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            colors: ["#000"]
          },
          dropShadow: {
            enabled: false
          }
        },
        fill: {
          type: 'gradient'
        },
        legend: {
          position: 'top',
          labels: {
            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
          },
          itemMargin: {
            vertical: 20
          }
        },
        title: {
          text: 'Total Value',
          align: 'center',
          style: {
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#999'
          }
        },
        tooltip: {
          custom: function({
            series,
            seriesIndex,
            w
          }) {
            return '<div style="color:#000;text-align:center;"><div style="padding:12px;width:100%;height:100%;background-color:' + w.globals.colors[seriesIndex] + '"><span>' + w.globals.labels[seriesIndex] +
              '</span></div><div style="padding:12px;background-color:#fff"><span>' + series[seriesIndex] + ' ' + w.config.subtitle.text + '</span></div></div>'
          }
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
            expandOnClick: false,
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  offsetY: -10
                },
                value: {
                  show: true,
                  fontSize: '22px',
                  color: getComputedStyle(document.body).getPropertyValue('--textColorSettings'),
                  offsetY: 16,
                  formatter: function(val, w) {
                    return val + " " + w.config.subtitle.text
                  }
                },
                total: {
                  show: true,
                  label: 'Total',
                  fontSize: '22px',
                  color: getComputedStyle(document.body).getPropertyValue('--textColorSettings'),
                  formatter: function(w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }).toFixed(2) + " " + w.config.subtitle.text
                  }
                }
              }
            }
          }
        },
        subtitle: {
          text: this.$store.state.settings.fiat.symbol,
          style: {
            fontSize: '0px'
          }
        }
      },
      optionsPL: {
        series: [],
        chart: {
          type: 'bar',
          id: 'apex-chart-pl',
          toolbar: {
            show: false
          },
          tempLegend: null,
          events: {
            legendClick: function(chartContext, seriesIndex, config) {
              if (!config.config.chart.tempLegend) {
                config.config.chart.tempLegend = config.config.series.map(el => {
                  return {
                    name: el.name,
                    visible: true
                  }
                })
              }
              config.config.chart.tempLegend[seriesIndex].visible = !config.config.chart.tempLegend[seriesIndex].visible
              config.config.xaxis.categories = config.config.chart.tempLegend.filter(el => el.visible).map(el => el.name)
            }
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '100%'
          }
        },
        noData: {
          text: 'No data with this filter',
          align: 'center',
          verticalAlign: 'top',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: getComputedStyle(document.body).getPropertyValue('--textColorSettings'),
            fontSize: '30px'
          }
        },
        dataLabels: {
          enabled: true,
        },
        tooltip: {
          custom: function({
            series,
            seriesIndex,
            w
          }) {
            return '<div style="color:#000;text-align:center;"><div style="padding:12px;width:100%;height:100%;background-color:' + w.globals.colors[seriesIndex] + '"><span>' + w.globals.labels[seriesIndex] +
              '</span></div><div style="padding:12px;background-color:#fff"><span>' + series[seriesIndex] + ' ' + w.config.subtitle.text + '</span></div></div>'
          }
        },
        yaxis: {
          title: {
            text: this.$store.state.settings.fiat.symbol,
            style: {
              color: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
            }
          },
          labels: {
            style: {
              colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
            }
          }
        },
        xaxis: {
          type: 'text',
          categories: [],
          labels: {
            style: {
              colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
            }
          }
        },
        legend: {
          position: 'top',
          offsetY: -15,
          labels: {
            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
          },
        },
        title: {
          text: 'Profit | Loss',
          align: 'center',
          style: {
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#999'
          }
        },
        subtitle: {
          text: this.$store.state.settings.fiat.symbol,
          style: {
            fontSize: '0px'
          }
        }
      },
      optionsROI: {
        series: [],
        chart: {
          type: 'bar',
          id: 'apex-chart-roi',
          toolbar: {
            show: false
          },
          tempLegend: null,
          events: {
            legendClick: function(chartContext, seriesIndex, config) {
              if (!config.config.chart.tempLegend) {
                config.config.chart.tempLegend = config.config.series.map(el => {
                  return {
                    name: el.name,
                    visible: true
                  }
                })
              }
              config.config.chart.tempLegend[seriesIndex].visible = !config.config.chart.tempLegend[seriesIndex].visible
              config.config.xaxis.categories = config.config.chart.tempLegend.filter(el => el.visible).map(el => el.name)
            }
          }
        },
        noData: {
          text: 'No data with this filter',
          align: 'center',
          verticalAlign: 'top',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: getComputedStyle(document.body).getPropertyValue('--textColorSettings'),
            fontSize: '30px'
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '100%'
          }
        },
        dataLabels: {
          enabled: true,
        },
        tooltip: {
          custom: function({
            series,
            seriesIndex,
            w
          }) {
            return '<div style="color:#000;text-align:center;"><div style="padding:12px;width:100%;height:100%;background-color:' + w.globals.colors[seriesIndex] + '"><span>' + w.globals.labels[seriesIndex] +
              '</span></div><div style="padding:12px;background-color:#fff"><span>' + series[seriesIndex] + ' %</span></div></div>'
          }
        },
        yaxis: {
          title: {
            text: '%',
            style: {
              color: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
            }
          },
          labels: {
            style: {
              colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
            }
          }
        },
        xaxis: {
          type: 'text',
          categories: [],
          labels: {
            style: {
              colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
            }
          }
        },
        legend: {
          position: 'top',
          offsetY: -15,
          labels: {
            colors: getComputedStyle(document.body).getPropertyValue('--textColorSettings')
          },
        },
        title: {
          text: 'Return on Investment (ROI)',
          align: 'center',
          style: {
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#999'
          }
        },
        subtitle: {
          text: this.$store.state.settings.fiat.symbol,
          style: {
            fontSize: '0px'
          }
        }
      }
    }
  },
  computed: {
    allWallets() {
      return this.$store.state.accounts.wallets
    },
    allExchanges() {
      return this.$store.state.accounts.apiKeys
    }
  },
  created() {
    this.calcPercentageAll('all')
  },
  mounted() {
    document.querySelectorAll('.filterMenu button').forEach((button) => {
      button.addEventListener('click', (e) => {
        document.querySelectorAll('.filterMenu button').forEach(item => {
          item.classList.remove('v-btn--active')
        })
        button.classList.add('v-btn--active')
        console.log("delete from event handler:" + e.target);
      })
    });
  },
  methods: {
    hider(string) {
      return mixin.hider(string)
    },
    setData(resTotal, resPL, resROI, filter, single) {
      this.optionsTotal = {
        ...this.optionsTotal,
        ...{
          series: resTotal.map(el => el.data[0]),
          labels: this.findLabels(filter, single)
        }
      }
      this.optionsPL = {
        ...this.optionsPL,
        ...{
          series: resPL.map(el => el),
          xaxis: {
            ...this.optionsPL.xaxis,
            categories: this.findLabels(filter, single)
          }
        }
      }
      this.optionsROI = {
        ...this.optionsROI,
        ...{
          series: resROI.map(el => el),
          xaxis: {
            ...this.optionsPL.xaxis,
            categories: this.findLabels(filter, single)
          }
        }
      }
    },
    findLabels(filter, single) {
      return this.$store.state.myCoins.filter(el => el.total != 0).filter(item => {
        if (filter == 'all') {
          return true
        }
        if (filter == 'manually') {
          if (item.purchases.filter(el => el.amount != 0).length > 0) {
            return true
          }
        }
        if (filter == 'walletSingle') {
          if (this.$store.state.accounts.imports.wallets.find(wallet => wallet.walletAddress == single).balances.find(balance => balance.coin == item.symbol.toUpperCase() && balance.include)) {
            return true
          }
        }
        if (filter == 'wallets') {
          if (this.$store.state.accounts.imports.wallets.filter(wallet => wallet.balances.some(balance => balance.coin == item.symbol.toUpperCase() && balance.include)).length > 0) {
            return true
          }
        }
        if (filter == 'exchangeSingle') {
          if (this.$store.state.accounts.imports.exchanges.find(exchange => exchange.apiKey == single).balances.find(balance => balance.coin == item.symbol.toUpperCase() && balance.include)) {
            return true
          }
        }
        if (filter == 'exchanges') {
          if (this.$store.state.accounts.imports.exchanges.filter(exchange => exchange.balances.some(balance => balance.coin == item.symbol.toUpperCase() && balance.include)).length > 0) {
            return true
          }
        }
      }).map(el => el.name)
    },
    calcPercentageAll(filter, single) {
      this.lastFilter = filter
      this.singleLastFilter = single
      let resROI = []
      let resTotal = []
      let resPL = []
      let netReturn = 0
      let costOfInvest = 0
      let total = 0
      let profitLoss = 0
      let calc = (balance, i) => {
        let amount = balance.amount;
        let price = balance.price;
        let fin = amount * this.$store.state.myCoins[i].price
        if (amount > 0) {
          total += fin
          if (price == 0) {
            if (this.$store.state.settings.taxes.active && fin > 0) {
              netReturn += fin - (this.$store.state.settings.taxes.percentage / 100) * fin;
              profitLoss += fin - (this.$store.state.settings.taxes.percentage / 100) * fin;
            } else {
              netReturn += fin;
              profitLoss += fin
            }
          } else {
            let a = amount * price;
            let b = amount * this.$store.state.myCoins[i].price;
            let netto = b - a
            let pl = fin - amount * price;
            if (this.$store.state.settings.taxes.active && netto > 0) {
              netReturn += netto - (this.$store.state.settings.taxes.percentage / 100) * netto;
              profitLoss += pl - (this.$store.state.settings.taxes.percentage / 100) * pl;
            } else {
              netReturn += netto
              profitLoss += pl
            }
            costOfInvest += a
          }
        }
      }
      this.$store.state.myCoins.forEach((item, i) => {
        if (filter == 'all' || filter == 'exchanges') {
          let exchangeFilter = this.$store.state.accounts.imports.exchanges.filter(exchange => exchange.balances.some(balance => balance.coin == item.symbol.toUpperCase() && balance.include))
          exchangeFilter.forEach((item2) => {
            calc(item2.balances.find(balance => balance.coin == item.symbol.toUpperCase() && balance.include), i)
          });
        }
        if (filter == 'exchangeSingle') {
          let exchangeFilter = this.$store.state.accounts.imports.exchanges.find(el => el.apiKey == single).balances.find(balance => balance.coin == item.symbol.toUpperCase() && balance.include)
          if (exchangeFilter) {
            calc(exchangeFilter, i)
          }
        }
        if (filter == 'walletSingle') {
          let walletFilter = this.$store.state.accounts.imports.wallets.find(el => el.walletAddress == single).balances.find(balance => balance.coin == item.symbol.toUpperCase() && balance.include)
          if (walletFilter) {
            calc(walletFilter, i)
          }
        }
        if (filter == 'all' || filter == 'wallets') {
          let walletFilter = this.$store.state.accounts.imports.wallets.filter(wallet => wallet.balances.some(balance => balance.coin == item.symbol.toUpperCase() && balance.include))
          walletFilter.forEach((item2) => {
            calc(item2.balances.find(balance => balance.coin == item.symbol.toUpperCase() && balance.include), i)
          });
        }
        if (filter == 'all' || filter == 'manually') {
          item.purchases.forEach((item2) => {
            calc(item2, i)
          });
        }
        let res
        if (costOfInvest == 0) {
          res = 100
        } else {
          res = (netReturn / costOfInvest) * 100
        }
        if (netReturn != 0) {
          resROI.push({
            name: item.name,
            data: [parseFloat(res.toFixed(2))]
          })
          resPL.push({
            name: item.name,
            data: [parseFloat(profitLoss.toFixed(2))]
          })
        }
        if (total != 0) {
          resTotal.push({
            name: item.name,
            data: [parseFloat(total.toFixed(2))]
          })
        }
        netReturn = 0
        costOfInvest = 0
        total = 0
        profitLoss = 0
      });
      this.setData(resTotal, resPL, resROI, filter, single)
    }
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
}

.chartHolder {
  margin: 0 auto;
}

.chartHolder {
  max-width: 600px;
}

.apexcharts-tooltip.apexcharts-theme-dark {
  background: #f3f3f3;
  color: orange;
}

.chartHolder>div:last-child {
  margin-top: 80px;
}

.filterMenu {
  background-color: var(--listBGR2);
  width: fit-content;
  border-radius: 10px;
  margin: 0 auto;
  padding: 5px;
}

.filterMenu h3 {
  display: inline-block;
  color: var(--headTooltipText);
}

.filterMenu h4 {
  color: var(--headTooltipText);
}

.filterMenu .sektion,
.filterMenu h3 {
  margin-bottom: 10px;
}

.fa-info-circle {
  font-size: 16px;
  margin: 0;
  margin-left: 5px;
}

.v-btn--active {
  background-color: var(--primaryColor) !important
}
</style>
