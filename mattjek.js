const { ipcRenderer } = require('electron');
const { isEmptyObject } = require('jquery');

ipcRenderer.send('get-username');
const tjekBtn = document.getElementById('tjek-button');

tjekBtn.addEventListener('click', (event) => {
    ipcRenderer.send('get-homework');

})

ipcRenderer.on('homework', (event, data) => {
    let contentHolder = document.getElementById('content-holder');
    if (isEmptyObject(data)) {
        contentHolder.innerHTML = `
         <div class="row justify-content-center" style="height: auto;">
         <img src="congratulations.gif" style="height: 35vh; border-radius: 5px;">

       </div>
       <div class="row mt-2 justify-content-center">
         <p>Du har lavet alle opgaverne!</p>

       </div>
         `;
    } else {
        contentHolder.innerHTML = `<p>Du mangler følgende matematik opgaver:</p>`
        for (let nChapter of Object.keys(data)) {
            stringExercises = "";
            for (let exercise of data[nChapter]) {
                stringExercises += exercise + ', ';
            }
            
            contentHolder.innerHTML += `
            <div class="row my-2">
            <div class="col">
                <div class="alert alert-primary" role="alert">
                <div class="row">
                    <div class="col-5">
                    <div class="alert alert-dark mb-0">
                        ${nChapter}
                    </div>
                    </div>
                    <div class="col-7">
                    ${stringExercises}
                    </div>
                </div>
                </div>
            </div>
            </div>`;
        }
    }
});

ipcRenderer.on('username', (event, data) => {
    document.getElementById('name-holder-title').innerHTML = data;
});

function loadSettingsPage() {
    ipcRenderer.send('load-settings-page');
}