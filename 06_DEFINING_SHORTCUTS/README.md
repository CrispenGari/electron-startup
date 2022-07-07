### Defining Shortcuts

We will use the globalShortcut module to define shortcuts in our app. Note that `Accelerators` are Strings that can contain multiple modifiers and key codes, combined by the + character. These accelerators are used to define keyboard shortcuts throughout our application. In the code that follows we are going to show an example of how we can open a message dialog box with the command `CommandOrControl+O`.

```js
app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CommandOrControl+O", () => {
    dialog.showMessageBox({
      title: "Shortcuts",
      message: "The command for opening a file dialog.",
    });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
```

### Ref

1. [www.electronjs.org](https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts)
