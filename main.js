
const { app, BrowserWindow } = require('electron')
const url = require('url');
const path = require('path');
let mainWindow
function createWindow () {
  mainWindow = new BrowserWindow({
    //fullscreen: true,
    //width: 1200,
    //height: 1000,
    icon: path.join(__dirname, 'public/ohana.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.setMenuBarVisibility(false); // Ocultar la barra de menú
  
  mainWindow.maximize(); // Maximiza la ventana cuando se crea
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/inventarioventas/browser/index.csr.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
