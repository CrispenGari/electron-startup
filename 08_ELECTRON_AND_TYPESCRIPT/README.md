### Electron and Typescript

In this repository we are going to setup `electron.js` with typescript.

### Getting started

First of all we need to run the following command:

```shell
yarn init -y
```

> Note that i'm using `yarn` as a package manager instead of `npm` but it's one and the same thing.

After running the above command a `package.json` file wll be created in the root folder of our project. Next we need to install the following packages:

1. electron
2. typescript

We will run the following commands to successifully install `electron` packages for typescript language.

```shell

yarn add electron

# typescript installation
yarn add -D typescript
# typescript types for node and electron

yarn add -D @types/electron @types/node
```

### tsconfig.json

After we have installed our packages we need to create a `tsconfig.json` file in the root folder of our project. For that we are going to run the following command:

```shell
tsc -init
```

A `tsconfig.json` file will be created in the root folder of our project and we will need to modify it based on what we want. We are going to modify it to look as follows:

```json
{
  "compilerOptions": {
    ...
    "rootDir": "./dist",
    ...
  }
}

```

We are going to set the `rootDir` to dist as follows. This is where our compiled javascript files will live. Our folder structure will look as follows:

```shell
📁 root
  📁 dist
    📁 scripts
  📁 src
    📁 scripts
       - index.ts
       - preload.ts
    📁 public
      - index.html
    📁 styles
      - index.css
  - tsconfig.json
  - package.json
```

Our `package.json` file will look as follows:

```json
{
  "name": "08_ELECTRON_AND_TYPESCRIPT",
  "version": "1.0.0",
  "main": "main.js",
  "author": "CrispenGari",
  "license": "MIT",
  "scripts": {
    "build": "tsc",
    "start": "yarn build && electron dist/main.js"
  },
  "dependencies": {
    "electron": "^19.0.8"
  },
  "devDependencies": {
    "@types/electron": "^1.6.10",
    "@types/node": "^18.0.3",
    "typescript": "^4.7.4"
  }
}
```

If we run the `build` script we are compiling typescript to javascript and when we run the `start` script we are accually running two commands, the `build` and starting an electron app with the compiled javascript files.

Our `index.html` file will contain the following code in it:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../styles/index.css" />
    <title>TypeScript and Electron</title>
  </head>
  <body>
    <h1>TypeScript and Electron</h1>
    <h2>Cors Count: 0</h2>
    <script src="../../dist/scripts/index.js"></script>
  </body>
</html>
```

In our `preload.ts` file we are going to count the number of `cpus` that we have in our computer and use the `contextBridge` api to expose them to the other scripts:

```ts
import { cpus } from "os";
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  threads: cpus().length,
});
```

In our `index.ts` which is our renderer we are going to have the following
code in it:

```ts
console.log("Hello electron.ts from renderer.");

//@ts-expect-error
document.querySelector("h2").innerText = "Cors Count: " + api.threads;
```

We are using a `//@ts-expect-error` decorator to ignore typescript errors.

In our main process we are going to have the following code in it:

```ts
import path from "path";
import { app, BrowserWindow } from "electron";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "../dist/scripts/preload.js"), // the compiled version of ts
    },
  });

  win.loadFile(path.join(__dirname, "../src/public/index.html"));

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

Now if we run the following command:

```shell
yarn start

```

Then an electron app will be up and running.
