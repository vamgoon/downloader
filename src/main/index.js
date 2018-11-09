import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import url from 'url';
import querystring from 'querystring';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`;

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        width: 1020,
        height: 670,
        frame: false,
        show: false
    });

    mainWindow.loadURL(winURL);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.session.on('will-download', (event, item) => {
        const dUrl = item.getURL();
        const parseObj = url.parse(dUrl);
        const queryObj = querystring.parse(parseObj.query);
        const vName = queryObj['v-name'];
        global[item + vName] = item;
        // 设置文件存放位置，如果用户没有设置保存路径，Electron将使用默认方式来确定保存路径（通常会提示保存对话框）
        global[item + vName].setSavePath(`/Users/vamgoon/Desktop/test/${+new Date() + item.getFilename()}`);
        ipcMain.on('cancel', (event, args) => {
            global[item + args].pause();
        });
        global[item + vName].on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed');
            } else if (state === 'progressing') {
                if (global[item + vName].isPaused()) {
                    console.log('Download is paused');
                } else {
                    console.log(`Received bytes: ${global[item + vName].getReceivedBytes()}`);
                }
            }
        });
        global[item + vName].once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully');
            } else {
                console.log(`Download failed: ${state}`);
            }
        });
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });
    /* eslint-disable */
    // console.log(mainWindow.webContents);
    /* eslint-enable */
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('download', (event, args) => {
    const dUrl = `https://www.nodejs.org/dist/v10.13.0/node-v10.13.0-darwin-x64.tar.gz?v-name=${args}`;
    mainWindow.webContents.downloadURL(dUrl);
});

