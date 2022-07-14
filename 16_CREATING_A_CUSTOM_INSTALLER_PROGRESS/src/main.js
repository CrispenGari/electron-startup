const path = require("path");
require("electron-reload")(__dirname);
const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const si = require("systeminformation");
let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 300,
    height: 260,
    roundedCorners: true,
    resizable: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "scripts/preload.js"),
    },
  });

  installer();
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

const installer = async () => {
  let progress = 0;
  const interval_id = setInterval(() => {
    progress += Math.random() * 3;
    win.setProgressBar(progress / 100);
    win.webContents.send("install/progress", progress);
    if (progress >= 100) {
      clearInterval(interval_id);
      win.setSize(400, 360);
      win.setProgressBar(-1);
    }
  }, 100);
};

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
