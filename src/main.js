const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

var globals = {
    mainWin: ""
};

function createWindow(file) {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });

    // TODO: Create icon
    // win.setIcon(path.join(__dirname, 'static/img/icon.png'));
    win.loadFile(path.join(__dirname, 'static', 'html', file));

    return win;
}

const template = [
    {
        label: "Wysi",
        submenu: [
            {
                label: 'Window',
                submenu: [
                    { role: "toggledevtools" },
                    { type: 'separator' },
                    { role: 'minimize' },
                    { role: 'togglefullscreen' },
                    { type: 'separator' },
                    { role: 'reload' },
                    { role: 'close' }
                ]
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.on("ready", () => {  
    globals.mainWin = createWindow("home.html");
    globals.mainWin.maximize();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow("home.html");
            globals.mainWin.maximize();
        }
    });
});

ipcMain.on('change-rendered', (event, file) => {
    globals.mainWin.loadURL(url.format({
        pathname: path.join(__dirname, 'static', 'html', file),
        protocol: 'file:',
        slashes: true
    }));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});