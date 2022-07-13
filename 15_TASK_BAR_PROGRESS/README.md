### Task Bar Progress

In this one we are going to show how we can create taskbar Progress on our application. We are going to work with the main process only. So in our main process we are going to create an interval function that will update the progress in every `120ms` for demo purposes. So in the `createWindow` function we are going to set the progress of our application as follows:

```js
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "scripts/preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "public/index.html"));

  let progress = 0;
  const interval_id = setInterval(() => {
    progress += 0.02;
    win.setProgressBar(progress);
    if (progress >= 1) {
      clearInterval(interval_id);
      win.setProgressBar(-1);
    }
  }, 120);
};
```

So in electron the progress value should be between `0` and `1`. `0` means no progress and `1` means progress finished. If you set a negative value for the `setProgressBar()` function then the progress will be returned to it's original state, a positive number above defines an undetermined progress.
