import BrowserWinHandler from './BrowserWinHandler'
import {
  ipcMain,
  screen
} from 'electron'
const {
  registerVuexHub
} = require('vuex-electron-ipc');

let barHandler = null
let primaryDisplay
const icon = process.resourcesPath + '/logo/icon.png'
function createWidgetBar(arg) {
  if (arg && !barHandler) {
    barHandler = new BrowserWinHandler({
      width: primaryDisplay.workAreaSize.width,
      height: storeClone.settings.widgetBar.height,
      alwaysOnTop: storeClone.settings.widgetBar.onTop,
      useContentSize: true,
      frame: false,
      fullscreenable: false,
      resizable: false,
      transparent: false,
      show: false,
      title: 'WidgetBar',
      icon: icon
    })

    barHandler.onCreated(_browserWindow => {
      barHandler.loadPage('/barPage')
      setTimeout(() => {
        barHandler.browserWindow.show()
      }, 2000)
      registerVuexHub()
      checkPositionWidgetBar()
    })
    barHandler.browserWindow.on('closed', function() {
      barHandler = null
    })
  }
  if (!arg) {
    try {
      barHandler.browserWindow.destroy()
      barHandler = null
    } catch {}
  }
}
ipcMain.on('request-action-widgetBar', (event, arg) => {
  primaryDisplay = screen.getPrimaryDisplay()
  createWidgetBar(arg)
});

let storeClone
ipcMain.on('VUEX_MUTATION', (event, arg) => {
  storeClone = {
    myCoins: JSON.parse(arg[1]),
    profitLoss: JSON.parse(arg[3]),
    total: JSON.parse(arg[4]),
    settings: JSON.parse(arg[2])
  }
  switch (arg[0].type) {
    case 'setSettingsWidgetBarOnTop':
      try {
        barHandler.browserWindow.setAlwaysOnTop(storeClone.settings.widgetBar.onTop, 'screen');
        break;
      } catch (e) {
        //console.log(e)
      }
    case 'setSettingsWidgetBarTop':
    case 'setSettingsWidgetBarCorrection':
      try {
        checkPositionWidgetBar()
        break;
      } catch (e) {
        //console.log(e)
      }

    case 'setSettingsWidgetBarHeight':
      try {
        barHandler.browserWindow.setBounds({
          height: storeClone.settings.widgetBar.height
        })
        checkPositionWidgetBar()
        break;
      } catch (e) {
        //console.log(e)
      }
  }
});

function checkPositionWidgetBar() {
  const workArea = primaryDisplay.workArea;
  const screenBounds = primaryDisplay.bounds;
  const workAreaHeight = primaryDisplay.workAreaSize.height;
  const displayHeight = primaryDisplay.bounds.height;
  const maxRes = primaryDisplay.workAreaSize
  const taskbarHeight = displayHeight - workAreaHeight;
  const isLinux = process.platform === 'linux';
  const isMac = process.platform === 'darwin';
  let taskbPosi
  let position
  if (workArea.x > 0) {
    if (isLinux && workArea.y > 0) {
      taskbPosi = 'top';
    } else {
      taskbPosi = 'left';
    }
  } else if (workArea.y > 0) {
    taskbPosi = 'top';
  } else if (workArea.width < screenBounds.width) {
    taskbPosi = 'right';
  } else {
    taskbPosi = 'bottom';
  }

  if (storeClone.settings.widgetBar.top) {
    if (taskbPosi == 'bottom') {
      position = 0
    }
    if (taskbPosi == 'top') {
        if (isMac) {
            position = workArea.y
        }else{
            position = taskbarHeight
        }
    }
  } else {
    if (taskbPosi == 'bottom') {
      position = maxRes.height - storeClone.settings.widgetBar.height
    }
    if (taskbPosi == 'top') {
        if (isMac) {
            position = maxRes.height - storeClone.settings.widgetBar.height + workArea.y
        }else{
            position = displayHeight - storeClone.settings.widgetBar.height
        }
    }
  }
  barHandler.browserWindow.setPosition(0, position + storeClone.settings.widgetBar.correction)
}
export default barHandler
