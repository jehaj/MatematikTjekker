const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const Store = require('electron-store');
const store = new Store();
const xlsxFile = require('read-excel-file/node');
const fs = require('fs');
const path = require('path')

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
    Menu.setApplicationMenu(null);

    // check which page should be loaded
    // 
    if (store.get('filePath') == null || store.get('folderPath') == null) {
        win.loadFile('startup.html');

    } else { win.loadFile('mattjek.html'); }
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
        filters: [{ name: 'Excel', extensions: ['xlsx'] }]
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

ipcMain.on('continue-from-settings', (event, data) => {
    // save settings
    store.set('filePath', data[0]);
    store.set('folderPath', data[1]);

    // go to new page
    win.loadFile('mattjek.html');
});

ipcMain.on('get-username', (event) => {
    let name = path.basename(store.get('folderPath')).substring(20);
    event.sender.send('username', name);
});

ipcMain.on('get-homework', (event) => {
    xlsxFile(store.get('filePath')).then((rows) => {
        // Get homework from excel file
        let exercisesFromFile = {};

        rows.forEach(row => {
            let exercisesFromRow = [];

            let exerciseString = row[1].split(',');

            exerciseString.forEach(element => {
                let exercise = element.split('-');
                if (exercise.length > 1) {
                    let range = rangeFromAndTo(parseInt(exercise[0], 10), parseInt(exercise[1], 10));
                    for (let n of range) {
                        exercisesFromRow.push(n);
                    }
                } else {
                    exercisesFromRow.push(parseInt(exercise, 10));
                }
            });

            exercisesFromFile[row[0]] = exercisesFromRow;
        });

        // Get homework in folder
        const directories = fs.readdirSync(store.get('folderPath'), { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        let exercisesYouHaveDone = {};

        for (let directory of directories) {
            if (exercisesFromFile[directory] != null) {
                const files = fs.readdirSync(path.join(store.get('folderPath'), directory), { withFileTypes: true })
                    .filter(dirent => dirent.isFile())
                    .map(dirent => dirent.name);

                let newFiles = [];
                for (let file of files) {
                    file = parseInt(file.substring(0, 4), 10);
                    newFiles.push(file);
                }

                exercisesYouHaveDone[directory] = newFiles;
            }
        }

        // Compare the two
        let missingExercises = {};

        for (let nDirectory of Object.keys(exercisesFromFile)) {
            let directory = exercisesFromFile[nDirectory];
            for (let exercise of directory) {
                if (exercisesYouHaveDone[nDirectory] == null || !exercisesYouHaveDone[nDirectory].includes(exercise)) {
                    if (missingExercises[nDirectory] == null) {
                        missingExercises[nDirectory] = [];
                    }
                    missingExercises[nDirectory].push(exercise);
                }
            }
        }

        event.sender.send('homework', missingExercises);

    });
});

function rangeFromAndTo(from, to) {
    let range = [];
    for (let index = from; index < to + 1; index++) {
        range.push(index);
    }
    return range;
}

ipcMain.on('load-settings-page', (event) => {
    win.loadFile('startup.html');
});
