### electron startup

In this repository we are going to have a look on how we can build effective and efficient cross-platform desktop applications using electron.js.

<img src="cover.png" alt="electron.js" width="100%"/>

### Languages

The following languages will be used in this repository.

```shell
- javascript (js)
- typescript (ts)
```

### Getting started.

In this section we are going to create a simple electron application. We are going to start by installation of `electron`

> The `code` for this section will be found in the `00_GET_STARTED` folder, of this repository.

Before we start make sure that you have `node` and `npm` installed on your computer. To check that we run the following commands:

```shell
node -v
# npm
npm -v

```

If you don't get any error which means we are good to go.

> In this example we are going to use the `yarn` package manager to create our new electron package. First we will run the following command to create the `yarn` package in node.js:

```shell
yarn init

# for npm
npm init
```

After answering some questions a package.json file will be created in the `00_GET_STARTED` folder and it will look as follows

```json
{
  "name": "00_GET_STARTED",
  "version": "1.0.0",
  "description": "this is a simple electron application.",
  "main": "main.js",
  "author": "CrispenGari",
  "license": "MIT"
}
```

### Installing `electron`

According to the docs electron is installed as a dev dependence. so we need to install electron as follows.

```shell
yarn add --dev electron

# npm
npm i --save-dev electron
```

After electron has been installed we need to go to our `package.json` and add the `start` scripts as follows:

```json
{
  "scripts": {
    "start": "electron ."
  }
}
```

We will need to create a `main.js` file in the root of the project, this is the entrypoint to an electron package. This script controls the main process, which runs in a full Node.js environment and is responsible for controlling your app's lifecycle, displaying native interfaces, performing privileged operations, and managing renderer processes (more on that later).

### Creating a webpage.

For code organization in our project we are going to create a folder called `src`. In this folder we are going to create two sub-folders which are `scripts`, `styles` and `public`. In the public folder we are going to create an `index.html` and add the following code into it.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../styles/index.css" />
    <title>Electron App</title>
  </head>
  <body>
    <div class="app">
      <h1>Hello Electron.js</h1>
      <p>
        This is an electron application that was built with Node version:
        <span class="node"></span>, Chrome version:
        <span class="chrome"></span> and Electron version:
        <span class="electron"> </span>
      </p>
    </div>
    <script src="../scripts/index.js"></script>
  </body>
</html>
```

In the above html file we have linked a `css` file which will be responsible for styling our webpage and we added the following code into it:

```css
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
}
span {
  background-color: lightgray;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: "Courier New", Courier, monospace;
}
```

We have also linked the `index.js` which is the `renderer` and because it runs in a web browser it gives us the ability to add more functionality to our webpage. Our `index.js` renderer file will have the following code in it

```js
console.log("Hello world from the renderer.");
```

### Main process

The main process happened in the `main.js` file. This is the main file electron will be looking for. We need to import two basic modules from electron which are:

1. The `app` module, which controls your application's event lifecycle.
2. The `BrowserWindow` module, which creates and manages application windows.

We will then create a function called `createWindow` which will create a BrowserWindow and load our `html` file. The `BrowserWindow` class accepts different options which can be found in the official documentation

In Electron, browser windows can only be created after the `app` module's ready event is fired. You can wait for this event by using the `app.whenReady()` API. Call `createWindow()` after `whenReady()` resolves its Promise.

```js
//  imports
const path = require("path");
const { app, BrowserWindow } = require("electron");

// createWindow Function

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "src/scripts/preload.js"), // path to our preload.js file
    },
  });

  mainWindow.loadFile(path.join(__dirname, "src/public/index.html")); // path to our html file

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
```

### The preload script.

A preload script runs before the renderer process is loaded, and has access to both renderer globals (e.g. `window` and `document`) and a `Node.js` environment. In our `preload.js` file we added the following code to it:

```js
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.querySelector(selector);
    if (element) element.innerText = text;
  };
  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`.${dependency}`, process.versions[dependency]);
  }
});
```

### Packaging and app distribution

The fastest way to distribute your newly created app is using `Electron Forge`.

> First we need to add electron-forge as a `dev` dependence in our project as follows:

```shell
yarn add -D @electron-forge/cli
#  then
npx electron-forge import

#  ******* Using npm *******
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

Output:

```shell
✔ Checking your system
✔ Initializing Git Repository
✔ Writing modified package.json file
✔ Installing dependencies
✔ Writing modified package.json file
✔ Fixing .gitignore


We have ATTEMPTED to convert your app to be in a format that electron-forge understands.

Thanks for using Electron Forge!!!
```

> Secondly we need to create a distributable using electron-forge as follows

```shell
yarn run make

# or with npm

npm run make
```

Output:

```shell
$ electron-forge make
✔ Checking your system
✔ Resolving Forge Config
We need to package your application before we can make it
✔ Preparing to Package Application for arch: x64
✔ Preparing native dependencies
✔ Packaging Application
Making for the following targets: squirrel
✔ Making for target: squirrel - On platform: win32 - For arch: x64
Done in 134.93s.
```

Electron Forge creates the `out` folder where your package will be located:

Folder Structures of the `out` folder:

```shell
C:.
├───00_GET_STARTED-win32-x64
│   ├───locales
│   └───resources
│       └───app
│           ├───node_modules
│           │   ├───@electron
│           │   ├───@electron-forge
│           │   ├───@gar
│           │   ├───@malept
│           │   ├───@nodelib
│           │   ├───@npmcli
│           │   ├───@sindresorhus
│           │   ├───@szmarczak
│           │   ├───@tootallnate
│           │   ├───@types
│           │   └───electron-squirrel-startup
│           │       ├───node_modules
│           │       │   ├───debug
│           │       │   │   └───src
│           │       │   └───ms
│           │       └───test
│           └───src
│               ├───public
│               ├───scripts
│               └───styles
└───make
    └───squirrel.windows
        └───x64
```

### Refs

1. [www.electronjs.org](https://www.electronjs.org/docs/latest/tutorial/quick-start)
2. [www.electronforge.io](https://www.electronforge.io/)
