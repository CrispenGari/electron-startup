const { contextBridge, ipcRenderer } = require("electron");
const { cpus } = require("os");

contextBridge.exposeInMainWorld("api", {
  on: (msg, cb) =>
    ipcRenderer.on(msg, (e, data) => {
      cb(data);
    }),
  cpus: cpus(),
  getCurrentLoad: (args) => ipcRenderer.invoke("get-current-load", args),
  closeApp: (args) => ipcRenderer.invoke(args),
});
