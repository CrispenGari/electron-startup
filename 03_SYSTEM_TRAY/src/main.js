const path = require("path");
const { app, BrowserWindow, Menu, ipcMain, Tray } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "public/index.html"));

  win.webContents.openDevTools({
    mode: "bottom",
  });
};

app.whenReady().then(() => {
  const tray = new Tray("./docker.png");
  const contextMenu = Menu.buildFromTemplate([
    { role: "close" },
    { type: "separator" },
    { role: "reload" },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ipc communication
