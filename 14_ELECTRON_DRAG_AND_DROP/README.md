### Drag and Drop

In this one we are going to learn how we can allow drag and drop on an electron app. Our application will check if a dropped item is a folder or file and do console.log

In the html we are going to have the following:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drag and Drop</title>
    <style>
      .dropzone {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80%;
        height: 50vh;
        border: 2px dotted gray;
        flex-direction: column;
        margin: 0px auto;
      }
    </style>
  </head>

  <body>
    <h1>Drag and Drop</h1>
    <div class="dropzone">
      <p id="message">Drag and Drop files only</p>
    </div>

    <script src="../scripts/index.js"></script>
  </body>
</html>
```

In the render we are going to have the following code in it.

```js
const dragzone = document.querySelector(".dropzone");
const message = document.querySelector("#message");

dragzone.addEventListener("dragover", (e) => {
  e.stopPropagation();
  e.preventDefault();

  message.innerText = "Drop file Here";
  dragzone.style.borderColor = "green";
});
dragzone.addEventListener("dragleave", (e) => {
  e.stopPropagation();
  e.preventDefault();
  message.innerText = "Drag and Drop files only";
  dragzone.style.borderColor = "gray";
});
dragzone.addEventListener("drop", async (e) => {
  e.stopPropagation();
  e.preventDefault();
  dragzone.style.borderColor = "gray";

  if (e.dataTransfer.files.length) {
    message.innerText = e.dataTransfer.files.length + " items selected.";
  }
  for (const item of e.dataTransfer.files) {
    const isFile = await api.isFile(item.path);
    console.log(isFile);
    console.log(item.path);
    // do whatever you want to do with these files
  }
});
```

In the preload script we are going to expose the `isFile` function to the main world. This function will be handled in the main process.

```js
const { contextBridge, ipcRenderer } = require("electron");
const { cpus } = require("os");

contextBridge.exposeInMainWorld("api", {
  cpus: cpus(),
  getSystemVersion: (args) => ipcRenderer.invoke("get-system-version", args),
  isFile: (path) => ipcRenderer.invoke("is-file", path),
});
```

In the main process we are going to handle the invoked event as follows

```js
ipcMain.handle("is-file", (e, args) => {
  return statSync(path.resolve(args)).isFile();
});
```
