### System Trays

A System tray is a menu outside of your application window. On MacOS and Ubuntu, it is located on the top right corner of your screen. On Windows it is on the bottom right corner. We can create menus for our application in system trays using Electron.

First we are going to have a `png` image which will act as our system tray icon.

```js
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain, Tray } = require("electron");

....
app.whenReady().then(() => {
  const tray = new Tray("./docker.png");
  const contextMenu = Menu.buildFromTemplate([
    { role: "close" },
    { type: "separator" },
    { role: "reload" },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
...
```

This is how we can create a system tray and append menu to it. Next we are going to have a look on how we can handle notifications in our electron app.
