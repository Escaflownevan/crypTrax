import BrowserWinHandler from './BrowserWinHandler'
import {
  app,
  Tray,
  ipcMain,
  nativeImage,
  Menu,
  BrowserWindow
} from 'electron'
const AutoLaunch = require('auto-launch');
const windowStateKeeper = require('electron-window-state');
const icon = process.resourcesPath + '/logo/icon.png'

var autoLauncher = new AutoLaunch({
  name: "crypTrax"
});

let winHandler
app.on('ready', () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1100,
    defaultHeight: 600
  });

  winHandler = new BrowserWinHandler({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 400,
    title: "crypTrax",
    frame: false,
    fullscreenable: true,
    resizable: true,
    transparent: false,
    icon: icon,
    show: false
  })

  winHandler.onCreated(_browserWindow => {
    winHandler.loadPage('/')
    createTrayIcon()
    mainWindowState.manage(winHandler.browserWindow);

    winHandler.browserWindow.webContents.setWindowOpenHandler(() => {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
          width: 1000,
          height: 800
        }
      }
    })
  })
});

ipcMain.on('request-action-showMainWindow', () => {
  winHandler.browserWindow.show()
});

ipcMain.on('request-widgetBar-toggleMainWindow', () => {
  winHandler.browserWindow.isVisible() ? winHandler.browserWindow.hide() : winHandler.browserWindow.show();
});

ipcMain.on('request-action-autostart', (event, arg) => {
  arg ? autoLauncher.enable() : autoLauncher.disable()

});

ipcMain.on('request-action-minimizewindow', () => {
  winHandler.browserWindow.hide();
});

ipcMain.on('request-action-maximizewindow', () => {
  winHandler.browserWindow.isMaximized() ? winHandler.browserWindow.restore() : winHandler.browserWindow.maximize();

});

ipcMain.on('request-action-closewindow', () => {
  //winHandler.browserWindow.destroy();
  let allWin = BrowserWindow.getAllWindows()
  allWin.forEach((item) => {
    try {
      item.destroy()
    } catch (e) {
      //console.log(e)
    }
  });
});



function createTrayIcon() {
  winHandler.tray = new Tray(nativeImage.createFromPath(icon).resize({
    width: 16,
    height: 16
  }));
  let contextMenu = Menu.buildFromTemplate([{
      label: 'Show / Hide crypTrax',
      type: 'normal',
      click: () => {
        winHandler.browserWindow.isVisible() ? winHandler.browserWindow.hide() : winHandler.browserWindow.show();
      }
    },
    {
      label: 'Exit',
      type: 'normal',
      click: () => {
        winHandler.browserWindow.destroy();

      }
    }
  ])

  winHandler.tray.setToolTip('crypTrax')
  winHandler.tray.setContextMenu(contextMenu)

}

export default winHandler
