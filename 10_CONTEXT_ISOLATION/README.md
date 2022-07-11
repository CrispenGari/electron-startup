### Context Isolation

> _Context Isolation is a feature that ensures that both your preload scripts and Electron's internal logic run in a separate context to the website you load in a webContents. This is important for security purposes as it helps prevent the website from accessing Electron internals or the powerful APIs your preload script has access to._ - docs

First thing we will need to to is to open our `main.js` under `webPreferences` we are going to set `contextIsolation` to `true` and specify the location where our `preload` script will be located as follows:

```js
const win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: true,
    preload: path.join(__dirname, "scripts/preload.js"),
  },
});
```

In our preload script we are going to allow the `api` to expose the cpus on our local computer, as well as a function that will get the system version. We are going to use the `contextBridge.exposeInMainWorld()` function. Our `preload.js` file will look as follows:

```js
const { contextBridge, ipcRenderer } = require("electron");
const { cpus } = require("os");

contextBridge.exposeInMainWorld("api", {
  cpus: cpus(),
  getSystemVersion: (args) => ipcRenderer.invoke("get-system-version", args),
});
```

`getSystemVersion` is a function that takes in args, and this function must be written in the main process so that why we invoked an event called `"get-system-version"`. In the main process we are going to handle this event and returns the result which is the data that the function is expected to return in the preload script. In our case we want to return the system version so we will need to make use of the [`systeminfomation`](https://systeminformation.io/general.html) package that will need to be installed as a node package as follows:

```shell

yarn add systeminfomation

```

In the main process we are going to add the following code in it.

```js
const si = require("systeminformation");
....
ipcMain.handle("get-system-version", async (e, args) => {
  console.log(args);
  const result = await si.version();
  return result;
});

```

### Consuming the `api`

In the renderer we will be able to consume the context that was exposed as `api` which is an object that contains property `cpus` and `getSystemVersion` function.

```js
document.addEventListener("DOMContentLoaded", async () => {
  console.log(api.cpus);
  await api.getSystemVersion("System Version").then((res) => console.log(res));
});
```

That's the basic about context isolation. It allows us to create secured electron apps.

### Ref

1. [www.electronjs.org](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
2. [systeminformation.io](https://systeminformation.io/general.html)
3. [ipc-renderer](https://www.electronjs.org/docs/latest/api/ipc-renderer)
