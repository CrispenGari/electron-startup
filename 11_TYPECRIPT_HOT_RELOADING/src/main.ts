import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import electronReload from "electron-reload";
import si from "systeminformation";
electronReload(__dirname, {});

console.log(__dirname);
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "/scripts/preload.js"), // the compiled version of ts
    },
  });

  win.loadFile(path.join(__dirname, "../../src/public/index.html"));

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

ipcMain.handle("get-system-version", async (_e, args) => {
  console.log(args);
  const result = await si.version();
  return result;
});
