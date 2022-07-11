const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
require("electron-reload")(__dirname);

let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "public/index.html"));
  win.webContents.openDevTools({
    mode: "bottom",
  });
  win.on("ready-to-show", () => win.show());
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ipc communication

ipcMain.on("close", (e, args) => {
  win.close();
  app.quit();
});

ipcMain.on("minimize", (e, args) => {
  if (win.isMaximized()) {
    win.minimize();
  } else {
    win.maximize();
  }
});

ipcMain.on("restore-down", (e, args) => {
  win.restore();
});
