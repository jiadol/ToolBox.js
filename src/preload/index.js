import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { db_path, sqliteInit } from "../db";

const fs = require("node:fs");
const process = require("node:process");
// const path = require("node:path");

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}

//main
fs.open(db_path, "wx", async (err, fd) => {// wx标志非空则不覆盖,存在会抛出异常
  if (!err) { //不存在才初始化，存在了直接跳过
    await sqliteInit();
    fs.close(fd);
  }
});


