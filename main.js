const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 1000, backgroundColor: 'black', frame: true})
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //Creating a child window to the mainWindow that will correspond
  //with video.html and will show when the video needs to be played
  let child = new BrowserWindow({parent: mainWindow, modal: true, height: 550, frame: false, show: false, transparent: true, fullscreen: true})
  child.loadURL(url.format({
    pathname: path.join(__dirname, 'video.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  child.webContents.openDevTools()
  mainWindow.webContents.openDevTools()

  //setting both windows to not have menus and the map to be full screen
  mainWindow.setMenu(null)
  mainWindow.setFullScreen(true)
  child.setMenu(null)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  //simple alternating of windows
  /*function alternate() {
    setInterval(function(){
      child.show()
          setTimeout(function() {
              child.hide()
            }, 3000);
    }, 6000);
  }*/

  //The main process recieves 'reset' from index.html when that
  //browser has been inactive for a set amount of time. The main
  //process then sends a message to the child to reset the video
  ipcMain.on('reset', function() {
    child.webContents.send('reset');
  })

  //Closes the child window when the main process recieves 'close-child'
  //from either of the other two renderer processes
  ipcMain.on('close-child', function() {
    child.hide()
  })

  //Opens the child window when the main process recieves 'open-child'
  //from either of the other two renderer processes
  ipcMain.on('open-child', function() {
    child.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
