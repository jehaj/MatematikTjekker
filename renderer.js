const { ipcRenderer } = require('electron');

const selectFileBtn = document.getElementById('select-file');
const selectFolderBtn = document.getElementById('select-folder');
const continueBtn = document.getElementById('continue-button');

selectFileBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-file-dialog');
});

selectFolderBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-folder-dialog');
});

ipcRenderer.on('selected-file', (event, path) => {
    console.log(path);
    document.getElementById('input-file').value = path;
});

ipcRenderer.on('selected-folder', (event, path) => {
    console.log(path);
    document.getElementById('input-folder').value = path;
});

continueBtn.addEventListener('click', (event) => {
    let selectFileText = document.getElementById('input-file').value;
    let selectFolderText = document.getElementById('input-folder').value;
    ipcRenderer.send('continue-from-settings', [selectFileText, selectFolderText]);
});