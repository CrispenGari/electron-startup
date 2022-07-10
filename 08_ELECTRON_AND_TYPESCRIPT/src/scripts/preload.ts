import { cpus } from "os";
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  threads: cpus().length,
});
