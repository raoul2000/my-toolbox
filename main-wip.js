const electron = require('electron');

const ipcMain = electron.ipcMain;
// Module to control application life.
const app = electron.app;
app.setName('My-Toolbox');

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url  = require('url');

const ENABLE_SPLASH_SCREEN = true;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let splash;

function createWindowLoader() {
  let main = null;
  let loading = new BrowserWindow({show: false, frame: false});

  loading.once('show', () => {
    main = new BrowserWindow({
      show: false,
      icon: path.join(__dirname, 'src/app/assets/image/if_toolbox_86483.ico')
    });
    main.webContents.once('dom-ready', () => {
      console.log('main loaded');
      main.show();
      loading.hide();
      loading.close();
    });
    // long loading html
    main.loadURL(url.format({
      pathname: path.join(__dirname, 'src/app/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  });
  loading.loadURL(url.format({
    pathname: path.join(__dirname, 'loading.html'),
    protocol: 'file:',
    slashes: true
  }));
  loading.show();
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: ENABLE_SPLASH_SCREEN ? false : true
    });

  // splash screen initialization
  if(ENABLE_SPLASH_SCREEN) {
    splash = new BrowserWindow({
      width: 500,
      height: 500,
      transparent: false,
      frame: false,
      alwaysOnTop: false
    });
    splash.loadURL(`file://${__dirname}/splash-2.html`);
    ipcMain.on('app-loaded', () => {
      splash.destroy();
      mainWindow.show();
    });
  }

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src/app/index.html'),
    //pathname: path.join(__dirname, 'splash-2.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  require('vue-devtools').install();
  require('devtron').install();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
//app.on('ready', createWindowLoader);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
