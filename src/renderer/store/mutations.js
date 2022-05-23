import mixin from '~/mixin/mixinGlobal'
export default {
  setBalanceOption(state, data) {
    switch (true) {
      case data.type == 'apiKey-include':
        state.accounts.imports.exchanges.find(el => el.apiKey == data.apiOrWallet).balances.find(el => el.coin == data.coin).include = data.value
        break;
      case data.type == 'walletAdress-include':
        state.accounts.imports.wallets.find(el => el.walletAddress == data.apiOrWallet).balances.find(el => el.coin == data.coin).include = data.value
        break;
      case data.type == 'apiKey-price':
        state.accounts.imports.exchanges.find(el => el.apiKey == data.apiOrWallet).balances.find(el => el.coin == data.coin).price = parseFloat(data.value)
        break;
      case data.type == 'walletAdress-price':
        state.accounts.imports.wallets.find(el => el.walletAddress == data.apiOrWallet).balances.find(el => el.coin == data.coin).price = parseFloat(data.value)
        break;
    }

    this.dispatch('calcHoldings');
  },
  setImportsExchanges(state, data) {
    state.accounts.imports.exchanges = data
  },
  saveNewWallet(state, data) {
    state.accounts.imports.wallets.push(data.single)
    state.accounts.wallets.push(data.addr)
    this.dispatch('calcHoldings');
  },
  increaseGetAllCoinsCurrentLoop(state) {
    state.getAllCoinsCurrentLoop++
  },
  resetGetAllCoinsCurrentLoop(state) {
    state.getAllCoinsCurrentLoop = 0
  },
  setMaxAllCoinsCurrentLoop(state) {
    state.getAllCoinsCurrentLoop = state.getAllCoinsMaxLoops
  },
  setTVitemPosition(state, data) {
    var element = state.settings.tv[data.index];
    state.settings.tv.splice(data.index, 1);
    if (data.direction == 'up') {
      state.settings.tv.splice(data.index - 1, 0, element);
    } else {
      state.settings.tv.splice(data.index + 1, 0, element);
    }
  },
  setImportsWallets(state, data) {
    state.accounts.imports.wallets = data
  },
  setSettingsAutostart(state, data) {
    state.settings.autostart = data
  },
  setSettingsWidgetBarOn(state, data) {
    state.settings.widgetBar.on = data
  },
  setSettingsWidgetBarOnTop(state, data) {
    state.settings.widgetBar.onTop = data
  },
  setSettingsWidgetBarOnly(state, data) {
    state.settings.widgetBar.only = data
  },
  updateSettingsTrueData(state, data) {
    switch (data.key) {
      case 'tvAdd':
        state.settings.tv.push(data.value)
        break;
      case 'tvRemove':
        state.settings.tv.splice(data.value, 1)
        break;
      case 'darkModeOn':
        state.settings.darkModeOn = data.value
        if (data.value) {
          document.getElementsByTagName('html')[0].setAttribute('class', 'dark')
        } else {
          document.getElementsByTagName('html')[0].removeAttribute('class', 'dark')
        }
        break;
      case 'fiat':
        state.settings.fiat = JSON.parse(data.value)
        state.myCoins = state.myCoins.map(item => {
          item.days30.timestamp = 0
          return item
        })
        this.dispatch('loadAllAPI');
        break;
      case 'taxes':
        if (typeof data.value == "boolean") {
          state.settings.taxes.active = data.value
        } else {
          state.settings.taxes.percentage = data.value
        }
        this.dispatch('calcHoldings');
        break;
      default:
        state.settings[data.key] = data.value
    }
  },
  set30Days(state, data) {
    Object.assign(state.myCoins[data.index], {
      days30: {
        dates: data.dates,
        prices: data.prices,
        timestamp: Date.now()
      }
    });
  },
  updateToggleColumns(state, data) {
    state.settings.view[data.index].view = data.value
  },
  setExchangeTradeHistory(state, data) {
    console.log(data.data)
    let crypted = mixin.crypt(data.apiKeyIndex)
    state.accounts.imports.exchanges.find(el => el.apiKey == crypted).trades = data.data

  },
  setSingleHoldings(state, data) {
    state.myCoins[data.index].total = data.valueTotal
    state.myCoins[data.index].profitLoss = data.valueProfitLoss
  },
  setAllCoins(state, data) {
    state.allCoins = data
  },
  setAllCoinsTimestamp(state, data) {
    state.allCoinsTimestamp = data
  },
  setAccountAPIKeys(state, data) {
    state.accounts.imports.exchanges.push(data.single)
    state.accounts.apiKeys.push(data.newKey)
    this.dispatch('calcHoldings');
  },
  delAllCoin(state) {
    state.myCoins = [];
    state.total = 0;
    state.profitLoss = 0;
  },
  pushMyCoins(state, data) {
    state.myCoins.push(data)
  },
  setMyCoins(state, data) {
    state.myCoins = JSON.parse(data)
  },
  updateMyCoinsListData(state, data) {
    Object.assign(state.myCoins[data.index], data.data)
  },
  setCGbtcPrice(state, data) {
    state.btcPrice = data
  },
  setCGglobal(state, data) {
    state.globalMarketCap = data
  },
  countAPICalls(state, data) {
    state.apiLimitCheck.apiCallsCounter += data
  },
  setMyCoinsSingle(state, data) {
    state.myCoins = state.myCoins.map(item => {
      if (item.id === data.id) {
        let dir
        switch (data.valueType) {
          case 'active':
            item[data.type][data.index][data.valueType] = data.data
            break;
          case 'price':
            item[data.type][data.index][data.valueType] = parseFloat(data.data)
            if (parseFloat(data.data) > item.price) {
              dir = true
            } else {
              dir = false
            }
            item[data.type][data.index]['directionBigger'] = dir
            break;
          default:
            item[data.type][data.index][data.valueType] = parseFloat(data.data)
        }
      }
      return item
    })
    this.dispatch('calcHoldings');
  },
  setHoldings(state, data) {
    state.total = data[0]
    state.profitLoss = data[1]
  },
  setSettingsWidgetBarTop(state, data) {
    state.settings.widgetBar.top = data
  },
  setSettingsWidgetBarHeight(state, data) {
    state.settings.widgetBar.height = parseFloat(data)
  },
  setSettingsWidgetBarCorrection(state, data) {
    state.settings.widgetBar.correction = parseFloat(data)
  },
  triggerCheckAlerts(state) {
    state.triggerCheckAlerts = !state.triggerCheckAlerts
  },
  triggerDataToWidgetBar(state) {
    state.settings.widgetBar.triggerDataToWidgetBar = !state.settings.widgetBar.triggerDataToWidgetBar
  },
  deactivateAlert(state, data) {
    state.myCoins[data.coinIndex].alerts[data.alertIndex].active = false
  },
  addPurchases(state, data) {
    state.myCoins[data.index].purchases.push({
      amount: 0,
      price: 0
    })

  },
  addAlert(state, data) {
    state.myCoins[data.index].alerts.push({
      active: false,
      price: 0,
      directionBigger: undefined
    })

  },
  delPurchaseAlerts(state, data) {
    state.myCoins = state.myCoins.map(item => {
      if (item.id === data.id) {
        item[data.type].splice(data.index, 1)
      }
      return item
    })
    this.dispatch('calcHoldings');
  },
  delEntry(state, data) {
    let index = -1
    switch (data.type) {
      case 'myCoins':
        state[data.type].splice(data.index, 1)
        this.dispatch('calcHoldings');
        break;
      case 'apiKey':
        index = state.accounts.imports.exchanges.findIndex(x => x.apiKey == data.apiKey)
        if (index > -1) {
          state.accounts.imports.exchanges.splice(index, 1)
        }
        state.accounts.apiKeys.splice(state.accounts.apiKeys.findIndex(x => x.apiKey == data.apiKey), 1)
        break;
      case 'wallets':
        state.accounts.imports.wallets.splice(state.accounts.imports.wallets.findIndex(x => x.walletAddress == data.data), 1)
        state.accounts.wallets.splice(state.accounts.wallets.indexOf(data.data), 1)
        break;
    }
    this.dispatch('calcHoldings');
  },
  setfreeAPISlotCheck(state, data) {
    state.apiLimitCheck.apiSlots.push({
      funcName: data.name,
      data: data.data
    })
  },
  resetStartValues(state) {
    state.apiLimitCheck.apiCallsCounter = 0
    state.apiLimitCheck.apiSlots = []
  },
  moveMyCoin(state, data) {
    if (data.direction == 'up') {
      mixin.arrayMove(state.myCoins, data.index, data.index - 1)
    } else {
      mixin.arrayMove(state.myCoins, data.index, data.index + 1)
    }
  },
  updateFavNews(state, data) {
    state.favNews = data
  },
  updateFavNewsLimit(state, name) {
    state.favNews.find(el => el.name == name).limit += 4

  },
  resetFavNewsLimit(state, name) {
    state.favNews.forEach((item) => {
      item.limit = 4
    });


  }
}
