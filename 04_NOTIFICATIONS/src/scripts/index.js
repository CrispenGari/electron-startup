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
