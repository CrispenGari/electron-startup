const path = require("path");
require("electron-reload")(__dirname);
const { app, BrowserWindow, ipcMain, dialog, screen } = require("electron");

const si = require("systeminformation");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 200,
    height: 100,
    y: 100,
    x: screen.getPrimaryDisplay().workArea.width - 300,
    frame: false,
    center: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "scripts/preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "public/index.html"));
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

ipcMain.handle("get-current-load", async (e, args) => {
  const result = await si.currentLoad();
  return result.currentLoad.toFixed(2);
});

ipcMain.handle("close-app", async (e, args) => {
  dialog
    .showMessageBox({
      title: "CPU Utilization",
      message: "Are you sure you want to close the CPU Utilization App?",
      buttons: ["yes", "no", "cancel"],
    })
    .then(({ response }) => {
      if (response === 0) {
        app.quit();
      } else {
        return;
      }
    });
});
