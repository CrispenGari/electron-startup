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
