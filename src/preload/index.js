import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { db_path } from "../db";

const fs = require("node:fs");
const process = require("node:process");
const path = require("node:path");

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
const fd = fs.openSync(db_path, "w"); // w 标志将确保创建空文件，非空则覆盖
fs.closeSync(fd); //创建后就关闭
