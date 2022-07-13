const path = require("path");
require("electron-reload")(__dirname);
const { app, BrowserWindow, ipcMain } = require("electron");

const si = require("systeminformation");
const {
  getWindowPosition,
  setWindowPosition,
  setWindowSize,
  getWindowSize,
} = require("./scripts/settings");

const createWindow = () => {
  const pos = getWindowPosition();
  const size = getWindowSize();
  const win = new BrowserWindow({
    width: size[0],
    height: size[1],
    x: pos ? pos[0] : undefined,
    y: pos ? pos[1] : undefined,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "scripts/preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "public/index.html"));

  win.on("resized", () => {
    setWindowSize(win.getSize());
  });
  win.on("moved", () => {
    setWindowPosition(win.getPosition());
  });

  win.webContents.openDevTools({
    mode: "bottom",
  });
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
