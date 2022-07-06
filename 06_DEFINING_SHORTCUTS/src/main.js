const path = require("path");
const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require("electron");

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
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ipc communication

ipcMain.on("context-menu", (e) => {
  const template = [
    {
      label: "Menu Item 1",
      click: () => {
        e.sender.send("context-menu-command", "menu-item-1");
      },
    },
    { type: "separator" },
    { label: "Menu Item 2", type: "checkbox", checked: true },
  ];
  const menu = Menu.buildFromTemplate(template);
  menu.popup(BrowserWindow.fromWebContents(e.sender));
});
