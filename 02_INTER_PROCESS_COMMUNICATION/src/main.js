const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

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

ipcMain.on("add", (e, args) => {
  const solution = args.number1 + args.number2;
  e.sender.send("solution", {
    number1: args.number1,
    number2: args.number2,
    operation: "add",
    answer: solution,
  });
});
