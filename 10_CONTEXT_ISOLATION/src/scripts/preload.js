const { contextBridge, ipcRenderer } = require("electron");
const { cpus } = require("os");

contextBridge.exposeInMainWorld("api", {
  cpus: cpus(),
  getSystemVersion: (args) => ipcRenderer.invoke("get-system-version", args),
});
