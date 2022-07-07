const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");

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

ipcMain.on("open-file", (event, args) => {
  dialog
    .showOpenDialog({
      message: "Select a file.",
      defaultPath: "/",
      title: "File Opener",
      buttonLabel: "Select",
    })
    .then(({ canceled, filePaths }) => {
      if (canceled) {
        console.log("Dialog Canceled");
      } else {
        const contents = fs.readFileSync(filePaths[0], { encoding: "utf8" });
        event.sender.send("file-data", contents);
      }
    });
});

ipcMain.on("save-file", (ev, args) => {
  dialog
    .showSaveDialog({
      message: "Save File As",
      buttonLabel: "Save",
      title: "Saving a File",
      defaultPath: path.join(__dirname, args.fileName),
    })
    .then(({ filePath, canceled }) => {
      if (canceled) return;
      fs.writeFileSync(filePath, args.content, {
        encoding: "utf8",
      });
      console.log("saved");
    });
});

ipcMain.on("show-message", (e, args) => {
  dialog
    .showMessageBox({
      title: "Message Dialog",
      message: args,
      type: "info",
      buttons: ["okay", "cancel", "close"],
      defaultId: 2,
    })
    .then((res) => console.log(res));
});

ipcMain.on("show-error", (e, args) => {
  dialog.showErrorBox("Error Dialog", args);
});
