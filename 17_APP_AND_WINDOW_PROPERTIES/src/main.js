const path = require("path");
require("electron-reload")(__dirname);
const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "scripts/preload.js"),
    },
    show: false,
  });
  win.loadFile(path.join(__dirname, "public/index.html"));
  win.on("ready-to-show", win.show);
};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  console.log(app.getPath("userData"));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ipc communication
