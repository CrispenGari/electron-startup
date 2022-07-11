const { ipcRenderer } = require("electron");

document.getElementById("restore-down").addEventListener("click", () => {
  ipcRenderer.send("restore-down", true);
});
document.getElementById("close").addEventListener("click", () => {
  ipcRenderer.send("close", true);
});
document.getElementById("minimize").addEventListener("click", () => {
  ipcRenderer.send("minimize", true);
});
