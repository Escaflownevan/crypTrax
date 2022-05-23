const ipcRenderer = window.require('electron').ipcRenderer;

export default async function(context) {
  let counter = 0

  if (!context.store.state.settings.widgetBar.only || (context.store.state.settings.widgetBar.only && !context.store.state.settings.widgetBar.on)) {
      ipcRenderer.send('request-action-showMainWindow');
  }
  if (context.store.state.settings.darkModeOn) {
    document.getElementsByTagName('html')[0].setAttribute('class', 'dark')
  }
  context.store.commit("resetStartValues")

  if (context.store.state.allCoinsTimestamp < (Date.now() - 86400000)) { //load once a day new coins by coingecko
    context.store.dispatch('getAllCoins');
  } else {
    console.log('Old coins loaded by local data');
    context.store.commit("setMaxAllCoinsCurrentLoop")
}
  context.store.dispatch('loadAllAPI');


  setInterval(function() {
    context.store.commit("resetStartValues")
    counter++
    let countETHwallets = context.store.state.accounts.imports.wallets.filter(el => el.walletType == 'ETH').length
    if (countETHwallets == 0) countETHwallets = 1
    if (counter == countETHwallets * 5) {

      context.store.dispatch('loadWalletsData');
      console.log("wallets loaded")
      counter = 0
    }
    context.store.dispatch('loadAllAPI');

    console.log("countdown reloaded | " + counter + " / " + countETHwallets * 5)
  }, 60000);


  if (context.store.state.settings.widgetBar.on) {


    ipcRenderer.send('request-action-widgetBar', true);
    setTimeout(() => {
      context.store.dispatch('triggerDataToWidgetBar')
    }, 5000)
    setTimeout(() => {
      context.store.dispatch('triggerDataToWidgetBar')
    }, 10000)
  }

}
