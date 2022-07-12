import { cpus } from "os";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  threads: cpus().length,
  getSystemVersion: (args: string) => ipcRenderer.invoke("get-version", args),
});
