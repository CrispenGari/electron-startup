### System Dialogs

In this sub-repository we are going to have a look a system dialogs that if provided by `electron` in the module `dialog`. We are going to have a look of the following dialog boxes:

1. showOpenDialog
2. showSaveDialog
3. showMessageDialog
4. showErrorDialog

### web-page

In our `index.html` file we are going to add the following code that we will use throughout this example of showing how to work with system dialogs.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dialogs</title>

    <style>
      #content {
        width: 400px;
        height: 200px;
        margin: 10px auto;
      }
    </style>
  </head>

  <body>
    <h1>Dialogs</h1>
    <button id="btn1">Open File</button>
    <button id="btn2">Show Error Message</button>
    <button id="btn3">Show Message</button>
    <button id="btn4">Save File</button>
    <textarea name="" id="content" cols="30" rows="10"></textarea>
    <script src="../scripts/index.js"></script>
  </body>
</html>
```

### showOpenDialog

This dialog box is used when we want to open a file on our system. We are going to read the file and write the data in the textarea. So in our renderer we will have the following code:

```js
const { ipcRenderer } = require("electron");

const textArea = document.getElementById("content");

document.getElementById("btn1").addEventListener("click", () => {
  ipcRenderer.send("open-file", {});
});
ipcRenderer.on("file-data", (ev, data) => {
  textArea.innerText = data;
});
```

In the main process we are going to have the following code in it:

```js
...
ipcMain.on("open-file", (event, args) => {
  dialog
    .showOpenDialog({
      message: "Select a file.",
      defaultPath: "/",
      title: "File Opener",
      buttonLabel: "Select",
    })
    .then(({ canceled, filePaths }) => {
      if (canceled) {
        console.log("Dialog Canceled");
      } else {
        const contents = fs.readFileSync(filePaths[0], { encoding: "utf8" });
        event.sender.send("file-data", contents);
      }
    });
});
...
```

### showSaveDialog

This dialog box is used to save the files to our local system. We are going to illustrate how to save save the contents that is in the textArea to a `contents.txt` file, In our renderer we are going to have the following code in it:

```js
document.getElementById("btn4").addEventListener("click", () => {
  ipcRenderer.send("save-file", {
    content: textArea.value,
    fileName: "contents.txt",
  });
});
```

In the main process we are going to have the following code in it:

```js
ipcMain.on("save-file", (ev, args) => {
  dialog
    .showSaveDialog({
      message: "Save File As",
      buttonLabel: "Save",
      title: "Saving a File",
      defaultPath: path.join(__dirname, args.fileName),
    })
    .then(({ filePath, canceled }) => {
      if (canceled) return;
      fs.writeFileSync(filePath, args.content, {
        encoding: "utf8",
      });
      console.log("saved");
    });
});
```

A file called `contents.txt` will be created with the typed text in the textarea.

### showErrorDialog

This dialog box is used to display errors. In this simple example we are going to show how to display error messages using the `showErrorDialog`.

```js
document.getElementById("btn2").addEventListener("click", () => {
  ipcRenderer.send("show-error", "This is an error message from the renderer.");
});
```

In the main process we are going to have the following code in it.

```js
ipcMain.on("show-error", (e, args) => {
  dialog.showErrorBox("Error Dialog", args);
});
```

### showMessageDialog

This dialog box is used to display messages. In this example we are going to click the button on the renderer and send the message to the main to display it in the message dialog.

```js
document.getElementById("btn3").addEventListener("click", () => {
  ipcRenderer.send("show-message", "This is the message from the renderer");
});
```

In the main process we are going to have the following code in it.

```js
ipcMain.on("show-message", (e, args) => {
  dialog
    .showMessageBox({
      title: "Message Dialog",
      message: args,
      type: "info",
      buttons: ["okay", "cancel", "close"],
      defaultId: 2,
    })
    .then((res) => console.log(res));
});
```

> For more options of dialog boxes you can read the docs. In the next section we are going to show how to define shortcuts.

### Ref.

1. [electronjs.org](https://www.electronjs.org/docs/latest/api/dialog)
