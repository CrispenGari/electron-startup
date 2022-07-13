### Electron Store

Up to now we are learning how to work with various electron api's but everytime we stop the application and start it again we are losing the state of the application. In this repository we are going to keep in track of the `position` and `size` of the window before the application is closed so that when you open it again you will continue from where you left. For this we are going to use an external package called `electron-store`. We need to install this package by running the following command:

```shell
yarn add electron-store
```

Next we are going to create a `settings.js` file in the scripts folder. This is where all the functions for storing data in `electron-store` will be made. So we are going to have getters and setters functions in this file.

> Note that `electron-store` stores data in `key` and `values` pairs like redis, so we can get, set and delete from the store. Our settings.js file will have the following code in it:

```js
const Store = require("electron-store");

const store = new Store();

const getWindowSize = () => {
  if (store.has("size")) {
    return store.get("size");
  }
  store.set("size", [800, 600]);
  return [800, 600];
};
const setWindowSize = (size) => {
  store.set("size", size);
};

const getWindowPosition = () => {
  if (store.has("position")) {
    return store.get("position");
  }
  return undefined;
};
const setWindowPosition = (pos) => {
  return store.set("position", pos);
};

module.exports = {
  getWindowSize,
  setWindowSize,
  setWindowPosition,
  getWindowPosition,
};
```

> In our `settings` we are keeping in track of the window position and size and manage them using `electron-store`.

Now in our `main.js` file we are going to add the following code in it

```js
...
const {
  getWindowPosition,
  setWindowPosition,
  setWindowSize,
  getWindowSize,
} = require("./scripts/settings");

const createWindow = () => {
  const pos = getWindowPosition();
  const size = getWindowSize();
  const win = new BrowserWindow({
    width: size[0],
    height: size[1],
    x: pos ? pos[0] : undefined,
    y: pos ? pos[1] : undefined,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "scripts/preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "public/index.html"));

  win.on("resized", () => {
    setWindowSize(win.getSize());
  });
  win.on("moved", () => {
    setWindowPosition(win.getPosition());
  });

  win.webContents.openDevTools({
    mode: "bottom",
  });
};
...

```

> That's all, now we can keep in track of the state of the application before it has been closed so that the user will open the application on the previously set state.

### Ref

1. [electron-store](https://github.com/sindresorhus/electron-store)
