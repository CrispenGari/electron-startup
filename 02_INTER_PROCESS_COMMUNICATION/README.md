### Inter Process Communication (IPC)

We have used this feature from the previous sub-repository. IPC allows us to make communication between our renderer and our main processes by providing two sub modules:

1. `ipcMain`

Is used to communicate asynchronously from the main process to renderer processes. We can send the messages from and to the render using this module by make use of events.

2. `ipcRenderer`

Is used to communicate asynchronously from a renderer process to the main process. We can also use this module to send messages from and to the main process by use of events.

### Communication between the main and render

We want to create a simple application that will takes numbers from form inputs and send them to the main process to do the multiplication of those two numbers in the main process. When the main process is done with the calculations we want to send back the answer to the render and display in the `DOM`. Our html file will look as follows:

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
    <h1>IPC</h1>
    <p>
      <input type="text" placeholder="Enter Number 1" id="number1" />
    </p>
    <p>
      <input type="text" placeholder="Enter Number 2" id="number2" />
    </p>
    <button id="btn">SEND</button>
    <pre>
      <code id="code"></code>
    </pre>

    <script src="../scripts/index.js"></script>
  </body>
</html>
```

In the `renderer` which is our `index.js` we will have the following code in it:

```js
const { ipcRenderer } = require("electron");

document.getElementById("btn").addEventListener("click", () => {
  const num1 = Number.parseFloat(document.getElementById("number1").value);
  const num2 = Number.parseFloat(document.getElementById("number2").value);
  ipcRenderer.send("add", {
    number1: num1,
    number2: num2,
    operation: "add",
  });
});

ipcRenderer.on("solution", (e, args) => {
  document.getElementById("code").innerText = JSON.stringify(args, null, 2);
});
```

In the `main` process we are going to have the following code in it.

```js

....
// ipc communication

ipcMain.on("add", (e, args) => {
  const solution = args.number1 + args.number2;
  e.sender.send("solution", {
    number1: args.number1,
    number2: args.number2,
    operation: "add",
    answer: solution,
  });
});

```

> That's all about the basics of `IPC`, in the next sub-repo we are going to look at the `SYSTEM TRAY`
