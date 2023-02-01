import { app, shell, BrowserWindow, Menu, ipcMain, globalShortcut } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import sagiri from "sagiri";
import { TraceMoe } from "trace.moe.ts";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      // 开启node // 开启remote
      nodeIntegration: true,   //添加语句
      contextIsolation: false,   //添加语句
      webSecurity: false //关闭chrome安全性，可以加载本地文件

    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  Menu.setApplicationMenu(null);
  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  //Set global shortCuts
  globalShortcut.register("CommandOrControl+J+K", () => {
    // 获取当前窗口
    BrowserWindow.getFocusedWindow().webContents.openDevTools();
  });


  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("web-contents-created", (e, webContents) => {
  webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url.toString());
  });
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// 接收从渲染进程发送到主进程的消息

/* server:baidubce:0,trace.moe:1,sauceNao:2
 * message:html or filepath
 * type: html:0,localfile:1
 *
 * }
 */
ipcMain.on("rtm-sagiri", async (event, server, message, type) => {
  try {
    if (server === 0) {
      return;
    } else if (server === 1) {
      const _api = new TraceMoe();
      const res = type === 0 ? await _api.fetchAnime(message) : await _api.fetchAnimeFromBuffer(fs.readFileSync(message));
      event.reply("mtr-sagiri", res);
    } else if (server === 2) {
      const client = sagiri("a95606255abbf3c402bcd3a94566ab48aef5273b");
      const res = await client(message);
      event.reply("mtr-sagiri", res);
    }
  } catch (e) {
    event.reply("mtr-sagiri", e);
  }
});
