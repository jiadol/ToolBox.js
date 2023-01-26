import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";

const path = require("path-browserify");

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        path: "path-browserify",
        util: "util/"
      }
    },
    plugins: [vue()],
    pluginOptions: {
      electronBuilder: {
        nodeIntegration: true
      }
    }
  }
});
