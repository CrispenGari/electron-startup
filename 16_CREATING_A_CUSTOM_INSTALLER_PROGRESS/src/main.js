const path = require("path");
require("electron-reload")(__dirname);
const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const si = require("systeminformation");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "scripts/preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "public/index.html"));

  let progress = 0;
  const interval_id = setInterval(() => {
    progress += 0.02;
    win.setProgressBar(progress);
    if (progress >= 1) {
      clearInterval(interval_id);
      win.setProgressBar(-1);
    }
  }, 120);
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

ipcMain.handle("get-system-version", async (e, args) => {
  console.log(args);
  const result = await si.version();
  return result;
});
