'use strict'
import {
    app,
    protocol,
    BrowserWindow,
    shell,
    ipcMain,
    Tray,
    Menu,
    screen,
    nativeImage
} from 'electron';
import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib';
import installExtension, {
    VUEJS_DEVTOOLS
} from 'electron-devtools-installer';

var AutoLaunch = require('auto-launch');
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';
const windowStateKeeper = require('electron-window-state');

const {
    dialog
} = require('electron')
var fs = require('fs');

let window = undefined; //widget bar window
let win;                 //main window

let icon = path.join(__static, 'icon.png')
let minimizewindow;
let oldRes = null
let primaryDisplay
let isLoaded = false

const isMac = process.platform === 'darwin';
let dir
if (isDevelopment) {
    dir = path.join(__dirname, '../data/')
} else {
    if (isMac) {
        dir = path.join(__dirname, '../../../../data/')
        //dir = path.join(process.env.HOME, "Library", "Application Support", "crypTrax")
    }else{
        dir = path.join(__dirname, '../../data/');
    }

}

function log(err) {
    fs.appendFile("log.txt", err + '\r\n', function(err) {
        if (err) throw err;
    });
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}]);

async function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1100,
        defaultHeight: 600
    });

    // Create the window using the state information
    win = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        minWidth: 600,
        minHeight: 400,
        title: "crypTrax",
        frame: false,
        fullscreenable: true,
        resizable: true,
        transparent: true,
        icon: icon,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindowState.manage(win);
    win.on('resize', mainWindowState.saveState);
    win.on('close', function(event) {
        if (minimizewindow) {
            event.preventDefault();
            win.hide();
        } else {
            try {
                window.destroy();
            } catch (e) {
                //console.log(e)
            }
            win.destroy();
            app.quit();
        }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) {
            win.webContents.openDevTools();
        }
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
    if (finalSettings.taskbarOnly && finalSettings.taskbarOn) {
        win.hide();
    }

    //open all links on system browser (external)
    win.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    ipcMain.on('request-action-closewindow', (event, arg) => {
        if (minimizewindow) {
            win.hide();
        } else {
            try {
                window.destroy();
            } catch (e) {
                //console.log(e)
            }
            win.destroy();
            app.quit();
        }
    });

    ipcMain.on('request-action-maximizewindow', (event, arg) => {
        const maxRes = primaryDisplay.workAreaSize
        let actRes = win.getSize()
        if (maxRes.width != actRes[0] || maxRes.height != actRes[1]) {
            win.maximize();
            oldRes = actRes
        } else {
            if (oldRes) {
                win.setSize(oldRes[0], oldRes[1])
            }
        }
    });

    ipcMain.on('request-action-toggleMainWindow', (event, arg) => {
        toggleMainWindow()
    });

    ipcMain.on('request-update-minimizewindow', (event, arg) => {
        minimizewindow = arg
    });

    ipcMain.on('request-action-minimizewindow', (event, arg) => {
        win.hide();
    });

    ipcMain.on('request-saveLocal', (event, arg) => {
        let name = dir + arg[0] + '.json';
        let data = arg[1];

        if (arg[0] == "settings" && isLoaded) {
            finalSettings = arg[1]
            Object.values(contextMenu.commandsMap)[0].checked = finalSettings.taskbarOn
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        if (data) {
            fs.writeFile(name, JSON.stringify(data), err => {
                if (err) {
                    //console.log(arg[0])
                    //console.error(err)
                    //return
                }
            })
        }
    });

    ipcMain.on('request-loadLocal', (event) => {
        let files = ["alerts", "allCoinsLocal", "myCoinsLocal", "boughtCoins", "settings", "allCoinsDate"]
        let allFiles = []
        files.forEach((item, i) => {
            try {
                let link = dir + item + ".json"
                let rawdata = fs.readFileSync(link);
                let final = JSON.parse(rawdata);
                allFiles.push(final)
            } catch (e) {
                allFiles.push([])
                //console.log(e)
            }
        });
        win.webContents.send('action-response-loadLocal', allFiles);
    });

    ipcMain.on('request-update-autostart', (event, arg) => {
        var autoLauncher = new AutoLaunch({
            name: "crypTrax"
        });
        // Checking if autoLaunch is enabled, if not then enabling it.
        autoLauncher.isEnabled().then(function(isEnabled) {
            if (arg) {
                if (isEnabled) {
                    return;
                } else {
                    autoLauncher.enable();
                }
            } else {
                if (!isEnabled) {
                    return;
                } else {
                    autoLauncher.disable();
                }
            }
        }).catch(function(err) {
            throw err;
        });
    });

    ipcMain.on('request-toggleTaskbar', (event, arg) => {
        if (arg) {
            try {
                window.show();
            } catch (e) {
                createTray();
                createTrayWindow();
                window.show();
            }
        } else {
            try {
                window.hide();
            } catch (e) {
                createTray();
                createTrayWindow();
                window.hide();
            }
        }
    });
    ipcMain.on('request-taskbarReload', (event, arg) => {
        window.setAlwaysOnTop(arg, 'screen');
    });
}
app.commandLine.appendSwitch('wm-window-animations-disabled');
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let finalSettings
try {
    let linkSettings = dir + "settings.json"
    let rawdataSettings = fs.readFileSync(linkSettings);
    finalSettings = JSON.parse(rawdataSettings);
} catch (e) {
    //console.log(e)
    finalSettings = false
}
app.on('ready', async () => {
    primaryDisplay = screen.getPrimaryDisplay()
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        //try {
        //  await installExtension(VUEJS_DEVTOOLS)
        //} catch (e) {
        //  console.error('Vue Devtools failed to install:', e.toString())
        //}
    }
    createWindow();
    createTray();
    createTrayWindow();
});

let contextMenu
let taskbPosi
const createTray = () => {
    win.tray = new Tray(nativeImage.createFromPath(icon).resize({ width: 16, height: 16 }));
    contextMenu = Menu.buildFromTemplate([{
            label: 'Show / Hide Widget Bar',
            type: 'normal',
            click: () => {
                toggleWindow()
            }
        },
        {
            label: 'Show / Hide Main Window',
            type: 'normal',
            click: () => {
                toggleMainWindow()
            }
        },
        {
            label: 'Exit',
            type: 'normal',
            click: () => {
                try {
                    window.destroy();
                } catch (e) {
                    //console.log(e)
                }
                win.destroy();
                app.quit();
            }
        }
    ])

    win.tray.setToolTip('crypTrax')
    win.tray.setContextMenu(contextMenu)

    win.tray.on('double-click', function(event) {
        toggleMainWindow();
    })
}

const toggleWindow = () => {
    try {
        let status = window.isVisible();
        status ? window.hide() : window.show()
        win.webContents.send('action-activeToggleTaskbar', status);
    } catch (e) {
        createTray();
        createTrayWindow();
    }
}

const toggleMainWindow = () => {
    try {
        win.isVisible() ? win.hide() : win.show();
    } catch (e) {
        createWindow();
    }
}
const isLinux = process.platform === 'linux';
const createTrayWindow = () => {
    const maxRes = primaryDisplay.workAreaSize
    window = new BrowserWindow({
        width: maxRes.width,
        height: 40,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: false,
        icon: icon,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    window.loadURL("file://" + path.join(__static, 'index_tray.html'));
    window.hide();
    if (finalSettings.taskbarOn) {
        window.show();
    }

    const workArea = primaryDisplay.workArea;
    const screenBounds = primaryDisplay.bounds;
    const workAreaHeight = primaryDisplay.workAreaSize.height;
    const displayHeight = primaryDisplay.bounds.height;
    const taskbarHeight = displayHeight - workAreaHeight;

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

    let position
    if (finalSettings.taskbarTop) {
        if (taskbPosi == 'bottom') {
            position = 0
        }
        if (taskbPosi == 'top') {
            position = taskbarHeight
        }
    } else {
        if (taskbPosi == 'bottom') {
            position = maxRes.height - taskbarHeight
        }
        if (taskbPosi == 'top') {
            position = displayHeight
        }
    }
    window.setPosition(0, position)
    window.setAlwaysOnTop(finalSettings.taskbarOnTop, 'screen');
    ipcMain.on('request-update-label-in-second-window', (event, arg) => { //send data to tray window
        window.webContents.send('action-update-label', arg);
    });
    isLoaded = true;
    ipcMain.on('request-toggleTaskbarPosition', (event, arg) => {

        let position
        if (arg) {
            if (taskbPosi == 'bottom') {
                position = 0;
            }
            if (taskbPosi == 'top') {
                position = taskbarHeight;
            }
        } else {
            if (taskbPosi == 'bottom') {
                position = maxRes.height - taskbarHeight;
            }
            if (taskbPosi == 'top') {
                position = displayHeight;
            }
        }
        window.setPosition(0, position);
    });
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        })
    }
}
