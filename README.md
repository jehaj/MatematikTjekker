# MatematikTjekker

## Installation
Hent den seneste udgivelse [her](https://github.com/NikolajK-HTX/MatematikTjekker/releases) og installer programmet.

## Hvad med de andre lignende programmer?
Det her bliver forhåbentligt den sidste version af MatematikTjekker. Den første var 'opgave-mangler', som blev lavet med electron, js og python, bagefter kom 'MatematikTjekker' lavet med C# og WPF. Den var hurtigere, men var ikke flot UI-mæssigt. Dette bliver det sidste forsøg med electron og js (ingen python). Jeg udelukker dog ikke muligheden for electron, js og C#... 🤔

## Byg det selv
Programmet kan/burde også køre på Linux eller macOS. Det kræver dog, at du selv bygger det. Jeg har brugt [electron-build](https://www.electron.build/) til at lave installationsprogrammet.
Til at starte med skal du have node.js installeret (det kan du finde [her](https://nodejs.org/en/)), derefter bør du installere yarn:
```npm install -g yarn```
Husk at befind dig i den rigtige mappe, da det er der projektet hentes hen til:
```
git clone https://github.com/NikolajK-HTX/MatematikTjekker.git
cd MatematikTjekker
npm install
yarn dist
```
Hvis det køres på Windows vil der være oprettet en ny mappe med navnet 'dist' som indeholder en .exe, der vil installere på programmet.
## Fejl eller andre problemer
Venligst opret en issue [her](https://github.com/NikolajK-HTX/MatematikTjekker/issues)
