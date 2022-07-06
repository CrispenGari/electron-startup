### Notifications

In this sub repository we are going to send notifications using `node-notifier`. We are going to use the the renderer which is our `scripts/index.js`. First we need to install `node-notifier` as follows:

```shell
yarn add node-notifier
```

We only want to get a notification when we click a button. In our html body we are going to have the following code in it:

```html
<body>
  <h1>Notifications</h1>
  <button id="btn">Notify</button>
  <script src="../scripts/index.js"></script>
</body>
```

Then in our renderer we are going to have the following code in it.

```js
const path = require("path");
const notifier = require("node-notifier");

document.getElementById("btn").addEventListener("click", () => {
  notifier.notify(
    {
      title: "Notification from Docker",
      message: "Hello you are now a Docker Guru.",
      icon: path.join(__dirname, "../docker.webp"), // Absolute path
      sound: true, // Only Notification Center or Windows Toasters
      wait: true, // Wait with callback, until user action is taken against notification
    },
    function (err, response) {
      // Response is response from notification
      console.log(response);
    }
  );
  notifier.on("click", function (notifierObject, options) {
    console.log("You clicked on the notification");
  });

  notifier.on("timeout", function (notifierObject, options) {
    console.log("Notification timed out!");
  });
});
```

Now if we click on the button we will get the notification from our application. Next we are gong to have a look on how we can work with `System Dialog`.
