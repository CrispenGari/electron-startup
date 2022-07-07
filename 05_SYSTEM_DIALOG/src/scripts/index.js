const { ipcRenderer } = require("electron");

const textArea = document.getElementById("content");

document.getElementById("btn1").addEventListener("click", () => {
  ipcRenderer.send("open-file", {});
});
ipcRenderer.on("file-data", (ev, data) => {
  textArea.innerText = data;
});

document.getElementById("btn2").addEventListener("click", () => {
  ipcRenderer.send("show-error", "This is an error message from the renderer.");
});
document.getElementById("btn3").addEventListener("click", () => {
  ipcRenderer.send("show-message", "This is the message from the renderer");
});
document.getElementById("btn4").addEventListener("click", () => {
  ipcRenderer.send("save-file", {
    content: textArea.value,
    fileName: "contents.txt",
  });
});
