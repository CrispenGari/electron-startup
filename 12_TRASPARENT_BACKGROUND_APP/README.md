### Transparent Background Application

In this repository we are going to create a simple application that has a transparent background. In the application we are going to keep in track of the `cpu` utilization for that we are going to use the `systeminformation` module to do that.

In the `main` process we are going to have the following code:

```js
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
```

In the `preload.js` file we are going to have the following code int it:

```js
const { contextBridge, ipcRenderer } = require("electron");
const { cpus } = require("os");

contextBridge.exposeInMainWorld("api", {
  cpus: cpus(),
  getSystemVersion: (args) => ipcRenderer.invoke("get-current-load", args),
  closeApp: (args) => ipcRenderer.invoke(args),
});
```

Then in our `index.js` file we are going to have the following code in it:

```js
document.addEventListener("DOMContentLoaded", () => {
  setInterval(async () => {
    await api.getSystemVersion("System Version").then((res) => {
      const h1 = document.querySelector("h1");
      if (res > 50) {
        h1.style.color = "red";
      } else {
        h1.style.color = "cornflowerblue";
      }
      h1.innerText = res + "%";
    });
  }, 1000);

  document.querySelector(".close__btn").addEventListener("click", () => {
    api.closeApp("close-app");
  });
});
```

Then our application will be up and running.
