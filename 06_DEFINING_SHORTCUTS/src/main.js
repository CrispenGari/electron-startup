const path = require("path");
const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  ipcMain,
  globalShortcut,
  dialog,
} = require("electron");

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
  createWindow();

  globalShortcut.register("CommandOrControl+O", () => {
    dialog.showMessageBox({
      title: "Shortcuts",
      message: "The command for opening a file dialog.",
    });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ipc communication
