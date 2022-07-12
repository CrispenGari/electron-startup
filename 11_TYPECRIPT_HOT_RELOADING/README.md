### Typescript App and Hot Reloading

In this section we are going to create an electron app with typescript as a programming language that with hot reloading enabled. We are going to use the [08_ELECTRON_AND_TYPESCRIPT](../08_ELECTRON_AND_TYPESCRIPT/) sub repo as the base for this one and we will add a new package called `electron-reload` as follows:

```shell
yarn add electron-reload
```

We are also going to need to install `concurrently` package, which allows us to run multiple commands at the same time. To install it we are going to run the following command:

```shell
yarn add concurrently
```

Now in the `main.ts` we are going to have the following code in it.

```ts
import path from "path";
import { app, BrowserWindow } from "electron";
import electronReload from "electron-reload";
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
```

The last thing that we need to do is to change our `scripts` in the `package.json` file. We are going to change the `start` script so that it will run two commands which are:

1. tsc -w
2. electron dist/main.js

```json
{
    ...
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "start": "concurrently \"yarn watch\" \"electron dist/src/main.js\""
  }
  ...
}
```

### Exposing Types and Namespaces

In the [08_ELECTRON_AND_TYPESCRIPT](../08_ELECTRON_AND_TYPESCRIPT/) on the renderer we had to add the `@ts-expect-error` decoration because typescript error that was saying `Cannot find name 'api'.`. But we know that `api` is defined in the `preload.js` so we need to expose this to typescript.

```ts
//@ts-expect-error
document.querySelector("h2").innerText = "Cors Count: " + api.threads;
```

For that we are going to create a file called `globals.d.ts` in the root of the `src` folder. Note that this file must have an extension `.d.ts` and add the following code to it.

```ts
declare namespace api {
  const threads: number;
  function getSystemVersion(args: string): string;
}
```

In our `preload.ts` we have the following code:

```ts
import { cpus } from "os";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  threads: cpus().length,
  getSystemVersion: (args: string) => ipcRenderer.invoke("get-version", args),
});
```

That's all in the next we are going to look on how we can create an application with transparent background.
