const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');

let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 700,
        height: 550,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Comment in to disable menu
    // Menu.setApplicationMenu(null);

    // check which page should be loaded
    // 
    win.loadFile('startup.html');
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [ { name: 'Excel', extensions: ['xlsx'] } ]
    }).then((value) => {
        event.sender.send('selected-file', value.filePaths[0]);
    });
});

ipcMain.on('open-folder-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then((value) => {
        event.sender.send('selected-folder', value.filePaths[0]);
    });
});

ipcMain.on('continue-from-settings', (event) => {
    // save settings

    // go to new page
    win.loadFile('mattjek.html');
});