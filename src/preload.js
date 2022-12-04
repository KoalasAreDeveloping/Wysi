const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    changeRendered: (file) => {
        ipcRenderer.send("change-rendered", file);
    }
});