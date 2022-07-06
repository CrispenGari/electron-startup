const { ipcRenderer } = require("electron");

window.document.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  ipcRenderer.send("context-menu");
});

ipcRenderer.on("context-menu-command", (e, command) => {
  console.log(command);
});
