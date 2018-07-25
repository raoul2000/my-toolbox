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
const SHOW_BACKGROUND_WINDOW = true;
const OPEN_DEVTOOLS = true;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let splash;
let backgroundWindow;

// identifies who is responsible for window closing action : main or background window
let closeRequestByMainWindow = false;


function createBackgroundWindow() {
  console.log("creating background window");

	backgroundWindow = new BrowserWindow({
		show: SHOW_BACKGROUND_WINDOW
	});
  backgroundWindow.loadURL(`file://${__dirname}/src/app/service/background/index.html`);
  if( OPEN_DEVTOOLS ) {
    backgroundWindow.webContents.openDevTools();
  }

  // background window can only be closed after the main window is closed. This prevent
  // the user from manually closing the bg window (tasks service would not be available anymore)
  backgroundWindow.on('close', function (event) {
    if(closeRequestByMainWindow === false) {
      event.preventDefault();
    }
  });

  // Emitted when the window is closed.
  backgroundWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    backgroundWindow = null;
  });
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

  if( OPEN_DEVTOOLS ) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    require('vue-devtools').install();
    require('devtron').install();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    if( backgroundWindow !== null) {
      closeRequestByMainWindow = true;
      backgroundWindow.close();
      backgroundWindow = null;
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready',  () => {
	createWindow();
	createBackgroundWindow();
});


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
    createBackgroundWindow();
  }
});

// Show/Hide the background Windows //////////////////////////////////////////////

ipcMain.on('toggle-task-view', (event) => {
  if( backgroundWindow.isVisible() ) {
    backgroundWindow.hide();
  } else {
    backgroundWindow.show();
  }
});

ipcMain.on('bg-window-show', (event) => {
  if( ! backgroundWindow.isVisible() ) {
    backgroundWindow.show();
  }
});

ipcMain.on('bg-window-hide', (event) => {
  if( backgroundWindow.isVisible() ) {
    backgroundWindow.hide();
  }
});

// event from the main render Window forwarded to the background
ipcMain.on('background-start', (event, payload) => {
  console.log("[M->B]");
  backgroundWindow.webContents.send('background-start', payload);
});

// event from the background forwarded to the main Render Window
ipcMain.on('background-response', (event, payload) => {
  console.log("[B->M]");
  mainWindow.webContents.send('background-response', payload);
});

// Background task execution channel ///////////////////////////////////////////

// Main -> background
ipcMain.on('submit-task', (event, payload) => {
  backgroundWindow.webContents.send('submit-task', payload);
});

// background -> Main
ipcMain.on('update-task', (event, payload) => {
  mainWindow.webContents.send('update-task', payload);
});
