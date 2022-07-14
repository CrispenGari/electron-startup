### Creating a Custom Installer

In this one we are going to create a simple custom installer progress. But before we do that we want to fix our scripts in the `package.json` file. We are going to specify that our entrypoint is `src/main.js` and then change our start script to:

```json
{
  "main": "src/main.js",
  "scripts": {
    "start": "electron ."
  }
}
```

Then after that we are going to start add the html contents to our webpage as follows.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskBar Progress</title>

    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }
      .app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-color: #022441;
        border-radius: 5px;
      }
      .app__loading > p {
        font-size: 0.8rem;
        color: gray;
        user-select: none;
        font-style: italic;
      }
      .app__loader {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 4px solid gray;
        border-top-color: cornflowerblue;
        animation: loading 1s ease 0s infinite;
        margin-bottom: 20px;
      }
      .dragable {
        -webkit-app-region: drag;
      }

      @keyframes loading {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      p {
        color: #42b983;
        font-size: 0.8rem;
      }
      .close__btn {
        width: fit-content;
        height: fit-content;
        background-color: cornflowerblue;
        border-radius: 50%;
        display: grid;
        place-items: center;
        margin: 5px;
        cursor: pointer;
        z-index: 100;
        transition: all 1s;
      }
      .close__btn:hover {
        background-color: #42b983;
      }
      .app__main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        flex: 1;
        height: 100%;
        user-select: none;
      }
      img {
        cursor: pointer;
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
      h1 {
        color: cornflowerblue;
        font-size: 2rem;
      }
      ::-webkit-scrollbar {
        display: none;
      }
      .app--main {
        flex-direction: row;
        align-items: flex-start;
      }
    </style>
  </head>
  <body>
    <template loading-template>
      <div class="app dragable">
        <div class="app__loading">
          <div class="app__loader"></div>
          <p>installing...</p>
        </div>
      </div>
    </template>
    <template main-app-template>
      <div class="app app--main">
        <div class="app__main dragable">
          <h1>0%</h1>
          <p>CPU Utilization</p>
        </div>
        <div class="close__btn">
          <img src="./close_111152.png" alt="" />
        </div>
      </div>
    </template>
    <script src="../scripts/index.js"></script>
  </body>
</html>
```

In the preload.js we are going to create our custom `on` function that will get the installation progress from the main process.

```js
const { contextBridge, ipcRenderer, dialog } = require("electron");
const { cpus } = require("os");

contextBridge.exposeInMainWorld("api", {
  on: (msg, cb) =>
    ipcRenderer.on(msg, (e, data) => {
      cb(data);
    }),
  cpus: cpus(),
  getCurrentLoad: (args) => ipcRenderer.invoke("get-current-load", args),
  closeApp: (args) => ipcRenderer.invoke(args),
});
```

In the main process we are going to create an `install` function,not that this install function is for demo purposes on a real application you may want to get the actual installation progress. The main process will have the following code in it

```js
const path = require("path");
require("electron-reload")(__dirname);
const { app, BrowserWindow, ipcMain } = require("electron");

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
```

In the renderer file we are going to have the following code and render templates based on a condition as follows:

```js
const loadingTemplate = document.querySelector("[loading-template]");
const appTemplate = document.querySelector("[main-app-template]");

api.on("install/progress", (progress) => {
  if (progress >= 100) {
    document.body.innerHTML = "";
    document.body.appendChild(appTemplate.content.cloneNode(true));
    setInterval(async () => {
      await api.getCurrentLoad("System Version").then((res) => {
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
      alert("clicked");
      api.closeApp("close-app");
    });
  } else {
    document.body.appendChild(loadingTemplate.content.cloneNode(true));
  }
});
```

Now we have our custom installation program.
