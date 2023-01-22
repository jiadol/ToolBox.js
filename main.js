const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')


const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        //frame: false, //取消window自带的关闭最小化等
        //resizable: false, //禁止改变主窗口尺寸
        //minWidth: 1200,
        //minHeight: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // 开启node // 开启remote
            nodeIntegration: true,   //添加语句
            contextIsolation: false,   //添加语句
            webSecurity:false //关闭chrome安全性，可以加载本地文件
        }
    })
    // mainWindow.loadFile("./dist/index.html")
    if (app.isPackaged) {
        mainWindow.loadFile("./dist/index.html")
    } else {
        mainWindow.loadURL('http://localhost:8000')
    }
    require('@electron/remote/main').initialize()
    require('@electron/remote/main').enable(mainWindow.webContents)
    require('electron-store').initRenderer()
    
    mainWindow.on('ready-to-show', () => {
        mainWindow.show
    })
    Menu.setApplicationMenu(null)
    mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})