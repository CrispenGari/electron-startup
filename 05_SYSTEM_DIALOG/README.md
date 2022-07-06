### Menus

In this repository we are going to have a look at how to create and work with menus in electron. There are two types of menus in desktop apps which are:

1. application menus - the menus that appears on the top of the application window.
2. context menus - the menus that pops up when you right click any where in the application window.

In this sub repository we are going to have a look at how we can create these two types of menus.

### Setup

For the set up we are going to create a package.json file in the `01_MENUS` folder and add the following code in it:

```json
{
  "name": "01_MENUS",
  "version": "1.0.0",
  "description": "creating menus in electron",
  "main": "main.js",
  "author": "CrispenGari",
  "license": "MIT",
  "scripts": {
    "start": "electron src/main.js"
  },
  "devDependencies": {
    "electron": "^19.0.7"
  }
}
```

After that we are gong to run:

```shell
yarn
```

This will install `electron` and we will create a file called `main.js` in the `src` folder. We are then going to create our `public/index.html` file and it will have the following code in it.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Menus</title>
  </head>
  <body>
    <h1>Menus</h1>
  </body>
</html>
```

### Application Menus

We will start by creating application menus.Our menus are going to be created from the `main` process.

```js
const path = require("path");
const { app, BrowserWindow, Menu, MenuItem } = require("electron");

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

const template = [
  {
    label: "Edit",
    submenu: [
      {
        role: "undo",
      },
      {
        role: "redo",
      },
      {
        type: "separator",
      },
      {
        role: "cut",
      },
      {
        role: "copy",
      },
      {
        role: "paste",
      },
    ],
  },

  {
    label: "View",
    submenu: [
      {
        role: "reload",
      },
      {
        role: "toggledevtools",
      },
      {
        type: "separator",
      },
      {
        role: "resetzoom",
      },
      {
        role: "zoomin",
      },
      {
        role: "zoomout",
      },
      {
        type: "separator",
      },
      {
        role: "togglefullscreen",
      },
    ],
  },

  {
    role: "window",
    submenu: [
      {
        role: "minimize",
      },
      {
        role: "close",
      },
    ],
  },

  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
      },
    ],
  },
];

const menu = Menu.buildFromTemplate([
  ...template,
  {
    label: "Languages",
    submenu: [
      {
        label: "Edit",
        click() {
          console.log("You clicked the edit");
        },
      },
      {
        label: "Languages",
        submenu: [
          {
            checked: true,
            label: "JavaScript",
            click() {
              console.log("You clicked JavaScript");
            },
          },
          {
            checked: false,
            label: "TypeScript",
            click() {
              console.log("You clicked TypeScript");
            },
          },
          {
            type: "separator",
          },
          {
            checked: false,
            label: "Python",
            click() {
              console.log("You clicked Python");
            },
          },
        ],
      },
    ],
  },
]);

Menu.setApplicationMenu(menu);

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

### Context Menus

We created our application menus in the `main` process. Next we are going to create our context menu in the `renderer`. We will create a file called `scripts/index.js` and we will link it with our html file.

```js
const { ipcRenderer } = require("electron");

window.document.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  ipcRenderer.send("context-menu");
});

ipcRenderer.on("context-menu-command", (e, command) => {
  console.log(command);
});
```

> As we can see we are using `Inter Process Communication` between the `Render` and the main `Main` in our `main.js` we will have the following code in it.

```js
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
```

In the next section we are going to look at how the `Inter Process Communication` works between the renderer and the main.
