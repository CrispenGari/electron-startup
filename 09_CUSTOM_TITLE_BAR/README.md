### Custom Title Bar

In this section we are going to show how to:

1. disable menus
2. create custom title bar
3. use of [electron-reload](https://www.npmjs.com/package/electron-reload)

### Enable hot reloading

To enable hot reloading in electron we need to make use of the [electron-reload](https://www.npmjs.com/package/electron-reload) package. First we wll need to install it:

```shell
yarn add electron-reload
```

Then we will open our main process which is the `main.js` file and do the following.

```js

const path = require("path");
const { app, BrowserWindow } = require("electron");
require("electron-reload")(__dirname); // enabling electron-reloading
...

```

> Now if you change code in the application, without restarting the server, then you will get real time changes in the BrowserWindow.

### Disable menus

To disable menus in electron is simple as to pass an option `autoHideMenu` during the creation of the BrowserWindow as follows

```js
const win = new BrowserWindow({
  width: 800,
  height: 600,
  center: true,
  show: false,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});
```

### Creating a custom title bar.

To create a custom title bar we are going to use regular `html` and `css` to customize our title bar. But first in the main process we are going to set the option `frame` as follows:

```js
const win = new BrowserWindow({
  width: 800,
  height: 600,
  center: true,
  show: false,
  autoHideMenuBar: true,
  frame: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});
```

Note that as soon as you set the option `frame` to `false` then we will not be able to drag the window, which will be customized using `css`. Now we will add the following snippet in our `html` for our custom title bar.

```html
<div class="app">
  <div class="header dragable">
    <div class="header__left"></div>
    <div class="header__center">
      <h2 id="title">My App</h2>
    </div>
    <div class="header__right">
      <button id="minimize">minimize</button>
      <button id="restore-down">restore-down</button>
      <button id="close">close</button>
    </div>
  </div>
  <div class="app__main non-dragable">
    <h1>Custom Title Bar 1</h1>
  </div>
</div>
```

In the styles we are going to allow drag on certain region for example only in our title bar by giving it a class called `dragable` and here are the styles for that.

```css
.dragable {
  -webkit-app-region: drag;
}
.non-dragable {
  -webkit-app-region: no-drag;
}
```

### Minimizing, Maximizing, Restoring Down and Closing the window

We are going to use our custom buttons to perform the following functionalities:

1. minimizing and Maximizing the window
2. restoring down and up the window
3. closing the window

In our `render` we are going to have the following:

```js
const { ipcRenderer } = require("electron");

document.getElementById("restore-down").addEventListener("click", () => {
  ipcRenderer.send("restore-down", true);
});
document.getElementById("close").addEventListener("click", () => {
  ipcRenderer.send("close", true);
});
document.getElementById("minimize").addEventListener("click", () => {
  ipcRenderer.send("minimize", true);
});
```

In the `main` we are going to modify t to look as follows:

```js
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
require("electron-reload")(__dirname);

let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, "public/index.html"));
  win.webContents.openDevTools({
    mode: "bottom",
  });
  win.on("ready-to-show", () => win.show());
};


....
// ipc communication

ipcMain.on("close", (e, args) => {
  win.close();
  app.quit();
});

ipcMain.on("minimize", (e, args) => {
  if (win.isMaximized()) {
    win.minimize();
  } else {
    win.maximize();
  }
});

ipcMain.on("restore-down", (e, args) => {
  win.restore();
});

```

> In the next one we are going to have a look on how we can do, `contextIsolation` in electron.

### Ref

1. [electron-reload](https://www.npmjs.com/package/electron-reload)
