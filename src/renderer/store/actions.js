const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
import balance from 'crypto-balances-2';
const ipcRenderer = window.require('electron').ipcRenderer;
import {
  getPortfolio
} from 'crypto-portfolio-viewer';
import mixin from '~/mixin/mixinGlobal.js';
import VuetifyDialog from 'vuetify-dialog'

export default {
  freeAPISlotCheck({
    state,
    commit
  }, wantedToCall) {
    if ((state.apiLimitCheck.apiCallsCounter + wantedToCall.needSlots) > state.apiLimitCheck.apiCallsLimit) {
      if (wantedToCall.data) {
        commit("setfreeAPISlotCheck", wantedToCall)

      } else {
        if (!state.apiLimitCheck.apiSlots.some(el => el.funcName == wantedToCall.name)) {
          commit("setfreeAPISlotCheck", wantedToCall)
        }
      }
      return false
    } else {
      return true
    }
  },
  loadAllAPI({
    dispatch,
    commit
  }) {
    dispatch('getCGbtcPrice');
    dispatch('getCGglobal');
    dispatch('getmyCoinsListData');
    dispatch('loadExchangesData');
    commit('triggerCheckAlerts')
  },
  getmyCoinsListData({
    state,
    commit,
    dispatch
  }) {
    if (state.myCoins.length != 0) {
      let allNeedSlots = 1 + state.myCoins.filter(el => el.days30.timestamp < (Date.now() - 86400000)).length
      dispatch('freeAPISlotCheck', {
        name: 'getmyCoinsListData',
        needSlots: allNeedSlots
      }).then(response => {
        if (response) go()
      })
      const go = async () => {
        try {
          let order = state.myCoins.map(el => el.id)

          let response = await CoinGeckoClient.coins.markets({
            ids: String(state.myCoins.map(el => el.id)),
            per_page: 250,
            localization: false,
            vs_currency: state.settings.fiat.name,
            price_change_percentage: "1h,24h,7d"
          });

          commit('countAPICalls', 1)
          response.data.forEach((item) => {
            let data = {
              id: item.id,
              name: item.name,
              symbol: item.symbol,
              logo_url: item.image,
              rank: item.market_cap_rank == null ? 'N/A' : item.market_cap_rank,
              price: item.current_price == null ? 'N/A' : item.current_price,
              btc_price: item.current_price == null ? 'N/A' : item.current_price / state.btcPrice,
              market_cap: item.market_cap == null ? 'N/A' : item.market_cap,
              high: item.ath == null ? 'N/A' : item.ath,
              time1h: item.price_change_percentage_1h_in_currency == null ? 'N/A' : item.price_change_percentage_1h_in_currency.toFixed(2),
              time1d: item.price_change_percentage_24h_in_currency == null ? 'N/A' : item.price_change_percentage_24h_in_currency.toFixed(2),
              time7d: item.price_change_percentage_7d_in_currency == null ? 'N/A' : item.price_change_percentage_7d_in_currency.toFixed(2),
              high_change_percentage: item.ath_change_percentage,
              high_date: item.ath_date == null ? 'N/A' : item.ath_date.slice(0, item.ath_date.indexOf("T")),
            }
            let index = order.indexOf(item.id)

            dispatch('get30Days', index);
            commit('updateMyCoinsListData', {
              data: data,
              index: index
            });

          })
          dispatch('calcHoldings')
        } catch (e) {
          console.log(e);
        }
      }


    }
  },
  getAllCoins({
    state,
    commit
  }) {
    let tempAllCoins = [];
    commit("resetGetAllCoinsCurrentLoop")
    let loadTopCoins = async () => {

      console.log("Loading Top Coins - Run: " + state.getAllCoinsCurrentLoop + " / " + state.getAllCoinsMaxLoops);

      try {
        let response = await CoinGeckoClient.coins.markets({
          per_page: 250,
          page: state.getAllCoinsCurrentLoop,
          localization: false,
          vs_currency: state.settings.fiat.name
        });

        response.data.forEach((item) => {
          let tempData = {
            value: item.id,
            id: item.id,
            name: item.name + " - " + item.symbol.toUpperCase(),
            logo: item.image,
            symbol: item.symbol.toUpperCase(),
            rank: item.market_cap_rank
          }
          tempAllCoins.push(tempData);
        });
        commit('countAPICalls', 1)
        if (state.getAllCoinsMaxLoops == state.getAllCoinsCurrentLoop) {
          let responseList = await CoinGeckoClient.coins.list();
          commit('setAllCoinsTimestamp', Date.now());
          commit('setAllCoins', _.unionBy(tempAllCoins, responseList.data.map(item => {
            return {
              value: item.id,
              symbol: item.symbol.toUpperCase(),
              name: item.name + " - " + item.symbol.toUpperCase()
            };
          }), 'value').sort((a,b) => a.rank - b.rank));
          console.log("Loading Top Coins complete")
          ipcRenderer.send('request-action-loadFinished', state.settings.widgetBar.only)
        } else {
          commit('increaseGetAllCoinsCurrentLoop');
          loadTopCoins();
        }
      } catch (e) {
        console.log(e);
        setTimeout(() => {
          loadTopCoins()
          console.log("Retry loading Top Coins");
      }, 5000);
      }
    }
    loadTopCoins()
  },
  async loadHistoryDate({
    state,
    commit
  }, data) {
    try {
        console.log(data)
      let response = await CoinGeckoClient.coins.fetchHistory(data.id, {
        date: data.date
      });
      console.log(response)
      commit('countAPICalls', 1)
      commit('setMyCoinsSingle', {
        id: data.id,
        type: 'purchases',
        valueType: 'price',
        index: data.index,
        data: mixin.twoDecimals(response.data.market_data.current_price[state.settings.fiat.name])
      });

    } catch (e) {
      console.log(e)
      /// = no Price for this date
    }
  },
  getCGbtcPrice({
    state,
    commit,
    dispatch
  }) {

    dispatch('freeAPISlotCheck', {
      name: 'getCGbtcPrice',
      needSlots: 1
    }).then(response => {
      if (response) go()
    })
    const go = async () => {
      try {
        let response = await CoinGeckoClient.simple.price({
          ids: ['bitcoin'],
          vs_currencies: state.settings.fiat.name,
        });
        commit('countAPICalls', 1)
        commit('setCGbtcPrice', response.data.bitcoin[state.settings.fiat.name]);
      } catch (e) {
        console.log(e)
      }
    }


  },
  async get30Days({
    state,
    commit
  }, data) {
    let index = data
    if (state.myCoins[index].days30.timestamp < (Date.now() - 86400000)) { //Update 30 Days prices for sparklines only every 24 hours
      try {
        let data = await CoinGeckoClient.coins.fetchMarketChart(state.myCoins[index].id, {
          vs_currency: state.settings.fiat.name,
          days: "30",
          interval: "daily"
        });
        commit('countAPICalls', 1)
        commit('set30Days', {
          index: index,
          prices: data.data.prices.map(el => mixin.twoDecimals(el[1])),
          dates: data.data.prices.map(el => mixin.twoDecimals(el[0]))
        });
      } catch (e) {
        console.log(e);
      }
    }
  },
  getCGglobal({
    state,
    commit,
    dispatch
  }) {
    dispatch('freeAPISlotCheck', {
      name: 'getCGglobal',
      needSlots: 1
    }).then(response => {
      if (response) go()
    })
    const go = async () => {
      try {
        let response = await CoinGeckoClient.global();
        commit('countAPICalls', 1)
        commit('setCGglobal', mixin.bigMoneyName(response.data.data.total_market_cap[state.settings.fiat.name]));
      } catch (error) {
        console.log(error);
      }
    }
  },
  loadWalletsData({
    state,
    commit
  }) {
    let allRes = []
    let i = 0
    let loadWallet = () => {
      let checkIncludes
      balance(state.accounts.wallets[i])
        .then(result => {
          let newObj = {
            walletType: result.address_type,
            walletAddress: state.accounts.wallets[i],
            balances: []
          }
          if (Object.entries(result.balances).length != 0) {
            Object.entries(result.balances).forEach(([key, value]) => {
              try {
                checkIncludes = state.accounts.imports.wallets.find(el => el.walletAddress == state.accounts.wallets[i]).balances.find(el => el.coin == key).include
                if (checkIncludes == undefined) {
                  checkIncludes = true
                }
              } catch {
                if (mixin.checkGecko(state.allCoins, key)) {
                  checkIncludes = true
                } else {
                  checkIncludes = false
                }

              }
              let balance = {
                coin: key,
                amount: value,
                price: 0,
                listed: mixin.checkGecko(state.allCoins, key),
                include: checkIncludes
              }
              newObj.balances.push(balance)
            });
            allRes.push(newObj)
          } else {
            allRes.push(newObj)
          }

          if (allRes.length == state.accounts.wallets.length) {
            commit('setImportsWallets', allRes);
          } else {
            i++
            setTimeout(() => { //Requests are limited to 2 per second, 30/min, 200/hour, 1000/24hours, 3000/week.
              loadWallet()
            }, 2000)
          }
        })
        .catch(error => console.log(`OH NO! ${error}`));
    }
    if (state.accounts.wallets.length > 0) {
      loadWallet()
    }
  },
  loadExchangesData({
    state,
    commit
  }) {
    let i = 0
    let resAll = []
    async function loadExchange() {
      let keys = {
        [state.accounts.apiKeys[i].exchange]: {
          apiKey: mixin.decrypt(state.accounts.apiKeys[i].apiKey),
          secret: mixin.decrypt(state.accounts.apiKeys[i].secret),
          password: mixin.decrypt(state.accounts.apiKeys[i].password)
        }
      }

      try {
        const portfolio = await getPortfolio({
          keys,
          verbose: false
        });
        let single = {
          exchange: state.accounts.apiKeys[i].exchange,
          apiKey: state.accounts.apiKeys[i].apiKey,
          balances: []
        }

        Object.values(portfolio[state.accounts.apiKeys[i].exchange]).forEach((value2, index) => {
          if (value2[0] != "TOTAL") {
            let checkIncludes
            let checkBuyPrice
            try {
              checkIncludes = state.accounts.imports.exchanges.find(el => el.apiKey == state.accounts.apiKeys[i].apiKey).balances[index - 1].include
              if (checkIncludes == undefined) {
                checkIncludes = true
              }
            } catch {
              checkIncludes = true
            }
            try {
              checkBuyPrice = state.accounts.imports.exchanges.find(el => el.apiKey == state.accounts.apiKeys[i].apiKey).balances[index - 1].price
              if (checkBuyPrice == undefined) {
                checkBuyPrice = 0
              }
            } catch {
              checkBuyPrice = 0
            }
            single.balances.push({
              coin: value2[0],
              amount: value2[1].count,
              include: checkIncludes,
              price: checkBuyPrice
            })
          }
        });
        resAll.push(single)

        if (state.accounts.apiKeys.length - 1 == i) {
          commit('setImportsExchanges', resAll);
        } else {
          i++
          setTimeout(() => {
            loadExchange()
          }, 2000)
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (state.accounts.apiKeys.length > 0) {
      loadExchange()
    }

  },

  updateMyCoins({
    commit
  }, data) {
    commit('setMyCoins', data);
  },
  pushMyCoins({
    commit
  }, data) {
    data.forEach((item) => {
      commit('pushMyCoins', {
        id: item,
        name: "",
        symbol: "",
        logo_url: "",
        rank: 0,
        price: null,
        market_cap: null,
        high: 0,
        time1h: null,
        time1d: null,
        time7d: null,
        total: 0,
        profitLoss: 0,
        alerts: [{
          price: 0,
          active: false,
          directionBigger: undefined
        }],
        purchases: [{
          amount: 0,
          price: 0
        }],
        days30: {
          dates: [],
          prices: [],
          timestamp: 0
        }
      });
    });
  },
  updateFavNews({
    commit
  }, data) {
    commit('updateFavNews', data);
  },
  updateFavNewsLimit({
    commit
  }, data) {
    commit('updateFavNewsLimit', data);
  },
  resetFavNewsLimit({
    commit
  }, data) {
    commit('resetFavNewsLimit');
  },
  setBalanceOption({
    commit
  }, data) {
    commit('setBalanceOption', data);
  },
  updateMyCoinsSingle({
    commit
  }, data) {
    commit('setMyCoinsSingle', data);
  },
  updateToggleColumns({
    commit
  }, data) {
    commit('updateToggleColumns', data);
  },
  delEntry({
    commit
  }, data) {
    commit('delEntry', data);
  },
  addPurchases({
    commit
  }, data) {
    commit('addPurchases', data);
  },
  addAlert({
    commit
  }, data) {
    commit('addAlert', data);
  },
  delPurchaseAlerts({
    commit
  }, data) {
    commit('delPurchaseAlerts', data);
  },
  updateSettingsTrueData({
    commit
  }, data) {
    commit('updateSettingsTrueData', data);
  },
  setSettingsAutostart({
    commit
  }, data) {
    commit('setSettingsAutostart', data);
  },
  setSettingsWidgetBarOn({
    commit
  }, data) {
    commit('setSettingsWidgetBarOn', data);
  },
  setSettingsWidgetBarOnTop({
    commit
  }, data) {
    commit('setSettingsWidgetBarOnTop', data);
  },
  setSettingsWidgetBarHeight({
    commit
  }, data) {
    commit('setSettingsWidgetBarHeight', data);
  },
  setSettingsWidgetBarCorrection({
    commit
  }, data) {
    commit('setSettingsWidgetBarCorrection', data);
  },
  triggerDataToWidgetBar({
    commit
  }, data) {
    commit('triggerDataToWidgetBar', data);
  },
  setSettingsWidgetBarTop({
    commit
  }, data) {
    commit('setSettingsWidgetBarTop', data);
  },
  setSettingsWidgetBarOnly({
    commit
  }, data) {
    commit('setSettingsWidgetBarOnly', data);
  },
  calcHoldings({
    state,
    commit
  }) {
    let allTotal = 0;
    let allProfitLoss = 0
    let singleTotal = 0
    let singleProfitLoss = 0
    let calc = (balance, i) => {
      let amount = balance.amount;
      let price = balance.price;
      let fin = amount * state.myCoins[i].price;
      allTotal += fin
      singleTotal += fin

      let pl = amount * state.myCoins[i].price - amount * price;
      if (state.settings.taxes.active && pl > 0) {
        let fin = pl - (state.settings.taxes.percentage / 100) * pl;
        allProfitLoss += fin
        singleProfitLoss += fin
      } else {
        allProfitLoss += pl;
        singleProfitLoss += pl
      }
    }
    state.myCoins.forEach((item, i) => {
      let exchangeFilter = state.accounts.imports.exchanges.filter(exchange => exchange.balances.some(balance => balance.coin == item.symbol.toUpperCase() && balance.include))
      let walletFilter = state.accounts.imports.wallets.filter(wallet => wallet.balances.some(balance => balance.coin == item.symbol.toUpperCase() && balance.include))
      let all = exchangeFilter.concat(walletFilter)
      if (all.length > 0) {
        all.forEach(allItem => {
          let balance = allItem.balances.find(balance => balance.coin == item.symbol.toUpperCase() && balance.include)
          calc(balance, i)
        })
      }
      item.purchases.forEach((item2) => {
        calc(item2, i)
      });
      commit('setSingleHoldings', {
        index: i,
        valueTotal: parseFloat(singleTotal.toFixed(2)),
        valueProfitLoss: parseFloat(singleProfitLoss.toFixed(2))
      });

      singleTotal = 0
      singleProfitLoss = 0
    });

    commit('setHoldings', [allTotal.toFixed(2), allProfitLoss.toFixed(2)]);
  }
}
